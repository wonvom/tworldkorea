import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createHandler, normalizeVariants } from "../server/inventory/relay.mjs";

const { quantitiesFor, refreshInterval } = createRequire(import.meta.url)("../js/inventory.js");
const product = { code: "7001", sizes: [{ size: "S" }, { size: "M" }] };
const origin = "https://www.tworldkorea.co.kr";
const env = { STOCK_RATE_LIMITER: { limit: async () => ({ success: true }) } };
function request(query = "product=7001", options = {}) {
  return new Request(`https://relay.example/stock?${query}`, { headers: { Origin: origin }, ...options });
}
function row(overrides = {}) {
  return { product_id: 11, products: { code: "7001", is_active: true }, color_code: "7001-01", size: "S", available_qty: 42, is_active: true, price: 4000, ...overrides };
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

test("refresh interval is exactly 30 seconds", () => assert.equal(refreshInterval, 30000));

test("color code mapping keeps only local sizes and distinguishes unknown from zero", () => {
  const quantities = quantitiesFor({ product: "7001", variants: [
    { colorCode: "7001-01", size: "S", quantity: 0 },
    { colorCode: "7001-01", size: "M", quantity: 123 },
    { colorCode: "7001-01", size: "XS", quantity: 555 },
    { colorCode: "7001-02", size: "S", quantity: 999 }
  ] }, product, "7001-01");
  assert.deepEqual([...quantities], [["S", 0], ["M", 123]]);
  assert.equal(quantities.has("XS"), false);
});

test("invalid quantities and duplicates never become fabricated stock", () => {
  for (const quantity of [null, undefined, "100", -1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(quantitiesFor({ product: "7001", variants: [{ colorCode: "7001-01", size: "S", quantity }] }, product, "7001-01").get("S"), null);
  }
  const variants = [1, 2, 3].map((quantity) => ({ colorCode: "7001-01", size: "S", quantity }));
  assert.equal(quantitiesFor({ product: "7001", variants }, product, "7001-01").get("S"), null);
  assert.throws(() => quantitiesFor({ product: "03XA5", variants: [] }, product, "7001-01"));
  assert.throws(() => quantitiesFor({ product: "7001", variants: null }, product, "7001-01"));
});

test("upstream normalization strips price and marks inactive/invalid/duplicate variants unknown", () => {
  const result = normalizeVariants({ rows: [row(), row({ size: "M", available_qty: 0 }), row({ size: "L", is_active: false }), row({ size: "XL", available_qty: null }), row({ size: "S", available_qty: 111 }), row({ products: { code: "OTHER", is_active: true } })] }, "7001");
  assert.deepEqual(result, [
    { colorCode: "7001-01", size: "S", quantity: null },
    { colorCode: "7001-01", size: "M", quantity: 0 },
    { colorCode: "7001-01", size: "L", quantity: null },
    { colorCode: "7001-01", size: "XL", quantity: null }
  ]);
  assert.throws(() => normalizeVariants({ rows: [] }, "7001"));
  assert.throws(() => normalizeVariants({ rows: [row({ product_id: 1 })] }, "7001"));
});

test("relay fetches only the fixed five source IDs, without credentials or caching", async () => {
  for (const [code, id] of [["01OA1", 1], ["7001", 11], ["03XA5", 12], ["T210", 13], ["23012", 15]]) {
    const handle = createHandler(async (url, options) => {
      assert.equal(url.href, `https://www.tworldkorea.kr/api/catalog/variants?product=${id}`);
      assert.equal(options.method, "GET");
      assert.equal(options.cache, "no-store");
      assert.equal(options.credentials, "omit");
      assert.equal(options.redirect, "manual");
      assert.deepEqual(options.headers, { Accept: "application/json" });
      return json({ rows: [row({ product_id: id, products: { code, is_active: true }, color_code: `${code}-01` })] });
    });
    const response = await handle(request(`product=${code}`), env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.equal(response.headers.get("Vary"), "Origin");
    const body = await response.json();
    assert.equal(body.product, code);
    assert.ok(Number.isFinite(Date.parse(body.queriedAt)));
    assert.deepEqual(body.variants, [{ colorCode: `${code}-01`, size: "S", quantity: 42 }]);
    assert.equal(JSON.stringify(body).includes("price"), false);
  }
});

test("bad paths, products, methods, origins and arbitrary URLs never call upstream", async () => {
  let calls = 0;
  const handle = createHandler(async () => { calls += 1; throw new Error("Unexpected fetch"); });
  for (const query of ["", "product=OTHER", "product=__proto__", "product=constructor", "product=7001&url=https://evil.example", "product=7001&product=01OA1"]) {
    assert.equal((await handle(request(query), env)).status, 400);
  }
  assert.equal((await handle(request("product=7001", { method: "POST" }), env)).status, 405);
  assert.equal((await handle(request("product=7001", { headers: { Origin: "https://evil.example" } }), env)).status, 403);
  assert.equal((await handle(request("product=7001", { headers: {} }), env)).status, 403);
  assert.equal((await handle(new Request("https://relay.example/other", { headers: { Origin: origin } }), env)).status, 404);
  assert.equal(calls, 0);
});

test("preflight permits only the expected read method and origin", async () => {
  const response = await createHandler()(request("product=7001", { method: "OPTIONS" }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Access-Control-Allow-Methods"), "GET, OPTIONS");
  assert.equal(response.headers.get("Access-Control-Allow-Credentials"), null);
});

test("missing limiter and rate limits fail closed without querying source", async () => {
  let calls = 0;
  const handle = createHandler(async () => { calls += 1; return json({ rows: [row()] }); });
  assert.equal((await handle(request(), {})).status, 503);
  const response = await handle(request(), { STOCK_RATE_LIMITER: { limit: async () => ({ success: false }) } });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.equal(calls, 0);
});

test("upstream errors and invalid data return an error, not an empty stock list", async () => {
  for (const response of [json({}, 500), json({}, 302), new Response("<html>error</html>"), json({ rows: [] }), json({ rows: [row({ product_id: 999 })] }), json({ rows: null })]) {
    const result = await createHandler(async () => response)(request(), env);
    assert.equal(result.status, 502);
    assert.deepEqual(await result.json(), { error: "Inventory unavailable" });
  }
});

test("oversized source responses are rejected", async () => {
  const response = new Response(new Uint8Array(2 * 1024 * 1024 + 1), { headers: { "Content-Type": "application/json" } });
  assert.equal((await createHandler(async () => response)(request(), env)).status, 502);
});
