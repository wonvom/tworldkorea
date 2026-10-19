const productIds = Object.freeze({ "01OA1": 1, "7001": 11, "03XA5": 12, "T210": 13, "23012": 15 });
const upstreamOrigin = "https://www.tworldkorea.kr";
const productionOrigins = ["https://www.tworldkorea.co.kr", "https://tworldkorea.co.kr"];

export function normalizeVariants(payload, code) {
  if (!Array.isArray(payload?.rows) || payload.rows.length > 5000) throw new Error("Invalid variants");
  const variants = new Map();
  for (const row of payload.rows) {
    if (!row || row.product_id !== productIds[code] || row.products?.code !== code) continue;
    if (typeof row.color_code !== "string" || !row.color_code.startsWith(`${code}-`)) continue;
    if (typeof row.size !== "string" || !/^[A-Za-z0-9-]{1,16}$/.test(row.size)) continue;
    const key = `${row.color_code}:${row.size}`;
    const quantity = row.available_qty;
    const active = row.is_active === true && row.products.is_active === true;
    variants.set(key, {
      colorCode: row.color_code,
      size: row.size,
      quantity: !variants.has(key) && active && Number.isSafeInteger(quantity) && quantity >= 0 ? quantity : null
    });
  }
  if (!variants.size) throw new Error("No matching variants");
  return Array.from(variants.values());
}

export function createHandler(fetchUpstream = fetch) {
  return async function handle(request, env = {}) {
    const origin = request.headers.get("Origin");
    const allowed = env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(",").map((value) => value.trim()) : productionOrigins;
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      Vary: "Origin"
    };
    function reply(body, status = 200, extra = {}) {
      return new Response(body === null ? null : JSON.stringify(body), { status, headers: { ...headers, ...extra } });
    }
    if (!origin || !allowed.includes(origin)) return reply({ error: "Origin not allowed" }, 403);
    headers["Access-Control-Allow-Origin"] = origin;
    const url = new URL(request.url);
    if (url.pathname !== "/stock") return reply({ error: "Not found" }, 404);
    if (request.method === "OPTIONS") {
      return reply(null, 204, { "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Accept", "Access-Control-Max-Age": "600" });
    }
    if (request.method !== "GET") return reply({ error: "Method not allowed" }, 405, { Allow: "GET, OPTIONS" });
    const code = url.searchParams.get("product");
    if (!Object.hasOwn(productIds, code) || url.searchParams.getAll("product").length !== 1 || Array.from(url.searchParams.keys()).some((key) => key !== "product")) {
      return reply({ error: "Unsupported product" }, 400);
    }
    if (!env.STOCK_RATE_LIMITER) return reply({ error: "Relay not configured" }, 503);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      // This is a public read-only relay, not a generic proxy. Origin checks are not authentication.
      const limit = await env.STOCK_RATE_LIMITER.limit({ key: `stock:${request.headers.get("CF-Connecting-IP") || "unknown"}` });
      if (!limit.success) return reply({ error: "Too many requests" }, 429, { "Retry-After": "60" });
      const source = new URL("/api/catalog/variants", upstreamOrigin);
      source.searchParams.set("product", productIds[code]);
      const response = await fetchUpstream(source, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "omit",
        redirect: "manual",
        signal: controller.signal
      });
      if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error("Upstream unavailable");
      const reader = response.body.getReader();
      const chunks = [];
      let length = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 2 * 1024 * 1024) {
          await reader.cancel();
          throw new Error("Upstream response too large");
        }
        chunks.push(value);
      }
      const body = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
      }
      const variants = normalizeVariants(JSON.parse(new TextDecoder().decode(body)), code);
      return reply({ product: code, queriedAt: new Date().toISOString(), variants });
    } catch (error) {
      if (env.LOG_ERRORS === "true") console.error("Inventory relay request failed", { product: code, message: String(error?.message || error) });
      return reply({ error: controller.signal.aborted ? "Upstream timeout" : "Inventory unavailable" }, controller.signal.aborted ? 504 : 502);
    } finally {
      clearTimeout(timeout);
    }
  };
}

