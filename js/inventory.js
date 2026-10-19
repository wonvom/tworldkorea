(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TworldInventory = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const productCodes = new Set(["01OA1", "7001", "03XA5", "T210", "23012"]);
  const refreshInterval = 30000;
  const requestTimeout = 10000;

  function quantitiesFor(payload, product, colorCode) {
    if (payload?.product !== product.code || !Array.isArray(payload.variants)) {
      throw new Error("Invalid inventory response");
    }
    const quantities = new Map();
    const seen = new Set();
    const sizes = new Set(product.sizes.map((size) => size.size));
    for (const variant of payload.variants) {
      if (!variant || variant.colorCode !== colorCode || !sizes.has(variant.size)) continue;
      const quantity = variant.quantity;
      quantities.set(variant.size, !seen.has(variant.size) && Number.isSafeInteger(quantity) && quantity >= 0 ? quantity : null);
      seen.add(variant.size);
    }
    return quantities;
  }

  function attach(selector, product, config) {
    if (!selector || config?.enabled !== true || !productCodes.has(product.code) || !config.endpoint) return null;
    let endpoint;
    try {
      endpoint = new URL(config.endpoint, location.href);
    } catch (error) {
      return null;
    }
    const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
    const localHttp = endpoint.protocol === "http:" && localHosts.has(location.hostname) && localHosts.has(endpoint.hostname);
    if (endpoint.protocol !== "https:" && !localHttp) return null;
    if (endpoint.username || endpoint.password) return null;
    const grid = selector.querySelector(".sample-size-grid");
    if (!grid) return null;

    const heading = document.createElement("div");
    heading.className = "stock-heading";
    grid.before(heading);
    heading.append(grid.parentElement.querySelector("h3"));
    const refresh = document.createElement("button");
    refresh.type = "button";
    refresh.className = "stock-refresh";
    refresh.title = "재고 새로고침";
    refresh.setAttribute("aria-label", "재고 새로고침");
    const icon = document.createElement("img");
    icon.src = "images/icons/refresh-cw.svg?v=20261019-inventory-live";
    icon.alt = "";
    icon.width = 16;
    icon.height = 16;
    refresh.append(icon);
    heading.append(refresh);

    const status = document.createElement("p");
    status.className = "stock-status";
    status.dataset.stockStatus = "";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    grid.after(status);
    const entries = Array.from(grid.querySelectorAll(".sample-size")).map((label) => {
      const input = label.querySelector("input");
      const text = document.createElement("span");
      text.className = "size-stock";
      text.dataset.stockSize = input.value;
      label.classList.add("sample-size--stock");
      label.append(text);
      return { input, text };
    });

    let selected = null;
    let timer = null;
    let controller = null;
    let sequence = 0;
    let disposed = false;
    let nextRefreshAt = 0;

    function paint(state, quantities) {
      grid.dataset.stockState = state;
      grid.setAttribute("aria-busy", String(state === "loading"));
      for (const { input, text } of entries) {
        const quantity = quantities?.get(input.value);
        const known = Number.isSafeInteger(quantity) && quantity >= 0;
        text.dataset.stockState = state === "ready" && known ? (quantity === 0 ? "empty" : "available") : state;
        text.textContent = state === "idle" ? "-" : state === "loading" ? "조회 중" : known ? (quantity === 0 ? "품절 (0장)" : `${quantity.toLocaleString("ko-KR")}장`) : "확인 불가";
        input.setAttribute("aria-label", `${input.value}, 재고 ${text.textContent}`);
      }
    }

    function cancel() {
      sequence += 1;
      clearTimeout(timer);
      timer = null;
      controller?.abort();
      controller = null;
    }

    function schedule() {
      clearTimeout(timer);
      timer = null;
      if (!disposed && selected && !document.hidden) timer = setTimeout(load, Math.max(0, nextRefreshAt - Date.now()));
    }

    async function load() {
      if (disposed || !selected || document.hidden) return;
      cancel();
      const current = sequence;
      const color = selected;
      nextRefreshAt = Date.now() + refreshInterval;
      const request = new AbortController();
      controller = request;
      const timeout = setTimeout(() => request.abort(), requestTimeout);
      refresh.disabled = true;
      paint("loading");
      status.textContent = `${color.name} 재고 조회 중`;
      try {
        const url = new URL(endpoint);
        url.searchParams.set("product", product.code);
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json" },
          signal: request.signal,
          referrerPolicy: "no-referrer"
        });
        if (!response.ok) throw new Error(`Inventory HTTP ${response.status}`);
        const quantities = quantitiesFor(await response.json(), product, color.code);
        if (current !== sequence || disposed) return;
        paint("ready", quantities);
        const complete = entries.every(({ input }) => Number.isSafeInteger(quantities.get(input.value)));
        const time = new Date().toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul", hour12: false });
        status.textContent = `${color.name} · ${time} 조회${complete ? "" : " · 일부 사이즈 확인 불가"}`;
      } catch (error) {
        if (current !== sequence || disposed) return;
        paint("error");
        status.textContent = `${color.name} · 재고 조회 실패`;
      } finally {
        clearTimeout(timeout);
        if (current === sequence && !disposed) {
          controller = null;
          refresh.disabled = false;
          schedule();
        }
      }
    }

    function choose(input) {
      const color = product.colors.find((entry) => entry.code === input.dataset.colorCode);
      if (!color) return;
      selected = { code: color.code, name: color.nameKr };
      load();
    }

    function onChange(event) {
      if (event.target.matches('input[name="sample-color"]') && event.target.dataset.colorCode !== selected?.code) choose(event.target);
    }

    function onClick(event) {
      // change covers keyboard selection; click also refreshes an already checked or restored radio.
      if (event.target.matches('input[name="sample-color"]')) choose(event.target);
    }

    function reset() {
      cancel();
      selected = null;
      paint("idle");
      status.textContent = "색상 미선택";
      refresh.disabled = true;
    }

    function onVisibility() {
      if (document.hidden) {
        cancel();
        if (selected) {
          paint("paused");
          status.textContent = `${selected.name} · 조회 일시중지`;
        }
      } else if (selected) load();
    }

    function onPageShow(event) {
      if (event.persisted && selected) load();
    }

    selector.addEventListener("change", onChange);
    selector.addEventListener("click", onClick);
    refresh.addEventListener("click", load);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", cancel);
    window.addEventListener("pageshow", onPageShow);
    reset();
    return {
      reset,
      destroy() {
        disposed = true;
        cancel();
        selector.removeEventListener("change", onChange);
        selector.removeEventListener("click", onClick);
        refresh.removeEventListener("click", load);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", cancel);
        window.removeEventListener("pageshow", onPageShow);
      }
    };
  }

  return Object.freeze({ attach, quantitiesFor, refreshInterval });
});
