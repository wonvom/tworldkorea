const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const base = "http://127.0.0.1:4173";
const output = path.join(root, "outputs/inventory-qa");
const codes = { "01OA1": 1, "7001": 11, "03XA5": 12, "T210": 13, "23012": 15 };
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/products.js"), "utf8"), sandbox);
const products = JSON.parse(JSON.stringify(sandbox.window.products));
const productFor = (code) => products.find((product) => product.code === code);

async function until(check, message) {
  const started = Date.now();
  while (Date.now() - started < 8000) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  throw new Error(`Timed out: ${message}`);
}

(async () => {
  const { createHandler } = await import("../server/inventory/relay.mjs");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
  let context;
  let page;
  try {
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    let enabled = false;
    let configEndpoint = "/api/stock";
    let mode = "ok";
    let baseQuantity = 42;
    let apiCalls = 0;
    let live = false;
    let releaseHeld = null;
    const requests = [];
    const errors = [];
    const responses = new Map();
    const relayEnv = {
      ALLOWED_ORIGINS: base,
      STOCK_RATE_LIMITER: { limit: async () => ({ success: true }) }
    };
    const relay = createHandler(async (url, options) => {
      if (live) return fetch(url, options);
      const id = Number(url.searchParams.get("product"));
      const [code] = Object.entries(codes).find(([, value]) => value === id);
      const product = productFor(code);
      const quantity = baseQuantity;
      const held = mode === "delay";
      if (held) {
        mode = "ok";
        await new Promise((resolve) => { releaseHeld = resolve; });
      }
      if (mode === "error") return new Response("unavailable", { status: 503 });
      const rows = product.colors.flatMap((color) => product.sizes.filter((size) => size.size !== "L").map(({ size }) => ({
        product_id: id,
        products: { code, is_active: true },
        color_code: color.code,
        size,
        available_qty: size === "M" ? 0 : quantity,
        is_active: true
      })));
      if (code === "7001") {
        rows.push({ ...rows[0], size: "XS", available_qty: 12345 });
        rows.push({ ...rows[0], color_code: "7001-07", available_qty: 12345 });
      }
      if (code === "23012") {
        rows.push({ ...rows[0], color_code: "23012-06", available_qty: 12345 });
        rows.push({ ...rows[0], color_code: "23012-07", available_qty: 12345 });
      }
      return new Response(JSON.stringify({ rows }), { headers: { "Content-Type": "application/json" } });
    });
    await context.route("**/data/inventory-config.js*", (route) => route.fulfill({
      contentType: "application/javascript",
      body: `window.inventoryConfig = { enabled: ${enabled}, endpoint: ${JSON.stringify(configEndpoint)} };`
    }));
    await context.route("**/api/stock?*", async (route) => {
      apiCalls += 1;
      requests.push(route.request().url());
      if (mode === "hang") {
        mode = "ok";
        await new Promise((resolve) => { releaseHeld = resolve; });
        await route.abort().catch(() => {});
        return;
      }
      const url = new URL(route.request().url());
      const response = await relay(new Request(`https://relay.example/stock${url.search}`, { headers: { Origin: base, "CF-Connecting-IP": "127.0.0.1" } }), relayEnv);
      const body = await response.text();
      if (response.ok) responses.set(url.searchParams.get("product"), JSON.parse(body));
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body }).catch(() => {});
    });
    page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.clock.install({ time: new Date("2026-10-19T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-19T12:00:01Z"));
    const open = async (code) => {
      await page.goto(`${base}/product-detail.html?id=${code}`, { waitUntil: "load" });
      await until(async () => await page.locator(".sample-selector").count() === 1, "product render");
    };
    const choose = (code) => page.locator(`.sample-choice:has(input[data-color-code="${code}"])`).click();
    const state = () => page.locator(".sample-size-grid").getAttribute("data-stock-state");
    const text = (size) => page.locator(`[data-stock-size="${size}"]`).textContent();
    const ready = () => until(async () => await state() === "ready", "stock ready");
    const waitCalls = (count) => until(() => apiCalls === count, `API count ${count}`);

    await open("7001");
    await choose("7001-01");
    assert.equal(await page.locator("[data-stock-status]").count(), 0);
    assert.equal(apiCalls, 0);
    console.log("PASS: production-disabled configuration leaves existing selector unchanged");

    enabled = true;
    for (const code of Object.keys(codes)) {
      await open(code);
      assert.equal(await state(), "idle");
      const before = apiCalls;
      await choose(productFor(code).colors[0].code);
      await ready();
      assert.equal(apiCalls, before + 1);
      assert.equal(await text("S"), "42장");
      assert.equal(await text("M"), "품절 (0장)");
      assert.equal(await text("L"), "확인 불가");
      assert.equal(await page.locator(".sample-size").count(), productFor(code).sizes.length);
    }
    console.log("PASS: all five products map stock by color code and keep existing size lists");

    await open("7001");
    assert.equal(await page.locator('input[name="sample-size"][value="XS"]').count(), 0);
    assert.equal(await page.locator('input[data-color-code="7001-07"]').count(), 0);
    await page.locator('input[data-color-code="7001-01"]').evaluate((input) => { input.checked = true; });
    await choose("7001-01");
    await ready();
    let keyboardBefore = apiCalls;
    await page.locator('input[data-color-code="7001-01"]').focus();
    await page.keyboard.press("ArrowRight");
    await ready();
    assert.equal(apiCalls, keyboardBefore + 1);
    assert.match(await page.locator("[data-stock-status]").textContent(), /블랙/);
    await choose("7001-01");
    await ready();
    let before = apiCalls;
    await choose("7001-01");
    await ready();
    assert.equal(apiCalls, before + 1);
    before = apiCalls;
    await page.getByRole("button", { name: "재고 새로고침", exact: true }).click();
    await ready();
    assert.equal(apiCalls, before + 1);
    before = apiCalls;
    await page.clock.runFor(29999);
    assert.equal(apiCalls, before);
    await page.clock.runFor(1);
    await waitCalls(before + 1);
    await ready();
    console.log("PASS: re-click, refresh icon and 30-second timer each issue a fresh request");

    mode = "delay";
    baseQuantity = 111;
    await choose("7001-01");
    await until(() => Boolean(releaseHeld), "delayed first request");
    baseQuantity = 999;
    await choose("7001-02");
    await ready();
    assert.equal(await text("S"), "999장");
    releaseHeld();
    releaseHeld = null;
    await new Promise((resolve) => setTimeout(resolve, 150));
    assert.equal(await text("S"), "999장");
    assert.match(await page.locator("[data-stock-status]").textContent(), /블랙/);
    console.log("PASS: delayed previous-color response cannot overwrite the selected color");

    mode = "error";
    await choose("7001-02");
    await until(async () => await state() === "error", "upstream error");
    assert.equal(await text("S"), "확인 불가");
    assert.equal(await text("M"), "확인 불가");
    mode = "ok";
    await page.clock.runFor(30000);
    await ready();
    assert.equal(await text("S"), "999장");
    mode = "hang";
    await choose("7001-02");
    await until(() => Boolean(releaseHeld), "hanging request");
    await page.clock.runFor(10000);
    await until(async () => await state() === "error", "request timeout");
    assert.equal(await text("S"), "확인 불가");
    releaseHeld();
    releaseHeld = null;
    await choose("7001-02");
    await ready();
    console.log("PASS: failures/timeouts clear stale values and later requests recover");

    before = apiCalls;
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, value: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.clock.runFor(60000);
    assert.equal(apiCalls, before);
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, value: false });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await ready();
    assert.equal(apiCalls, before + 1);
    before = apiCalls;
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    await page.clock.runFor(60000);
    assert.equal(apiCalls, before);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await ready();
    assert.equal(apiCalls, before + 1);
    console.log("PASS: hidden/exited pages stop polling and returning pages refresh immediately");

    await page.locator('.sample-size:has(input[value="S"])').click();
    await page.locator("[data-add-sample]").click();
    assert.equal(await state(), "idle");
    assert.equal(await page.locator('input[name="sample-color"]:checked').count(), 0);
    assert.equal(await text("S"), "-");
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("tworld-sample-list-v1"))[0].size), "S");
    before = apiCalls;
    await page.clock.runFor(60000);
    assert.equal(apiCalls, before);
    console.log("PASS: sample cart still works and clearing the selection stops refreshes");

    await open("23012");
    assert.equal(await page.locator('input[data-color-code="23012-06"], input[data-color-code="23012-07"]').count(), 0);
    await choose("23012-02");
    await ready();
    for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
      await page.setViewportSize(viewport);
      await page.clock.runFor(350);
      await page.locator(".sample-size-grid").scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled" });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const overflow = await page.locator(".sample-size--stock").evaluateAll((labels) => labels.some((label) => label.scrollWidth > label.clientWidth));
      assert.equal(overflow, false);
    }
    console.log("PASS: hidden colors stay hidden; desktop/mobile stock controls fit without overflow");

    before = apiCalls;
    await open("3505");
    assert.equal(await page.locator("[data-stock-status]").count(), 0);
    await page.locator(".sample-choice").first().click();
    await page.clock.runFor(60000);
    assert.equal(apiCalls, before);
    console.log("PASS: unrelated products have no stock UI or API traffic");

    configEndpoint = "https://[invalid";
    await open("7001");
    assert.equal(await page.locator("[data-stock-status]").count(), 0);
    assert.equal(await page.locator("[data-add-sample]").count(), 1);
    configEndpoint = "/api/stock";
    console.log("PASS: invalid relay configuration does not break the existing catalog");

    if (process.env.INVENTORY_LIVE_TEST === "1") {
      live = true;
      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const code of Object.keys(codes)) {
        await open(code);
        const color = productFor(code).colors[0];
        await choose(color.code);
        await ready();
        const quantity = responses.get(code).variants.find((variant) => variant.colorCode === color.code && variant.size === "S")?.quantity;
        assert.ok(Number.isSafeInteger(quantity));
        assert.equal(await text("S"), quantity === 0 ? "품절 (0장)" : `${quantity.toLocaleString("ko-KR")}장`);
        console.log(`PASS: real source -> local relay -> browser for ${code}`);
      }
      await page.locator(".sample-size-grid").scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, "live-desktop.png"), animations: "disabled" });
    }
    assert.deepEqual(errors, []);
    assert.ok(requests.every((url) => Object.hasOwn(codes, new URL(url).searchParams.get("product"))));
    console.log("PASS: no uncaught browser errors; only the five allowed products were requested");
  } catch (error) {
    if (page) await page.screenshot({ path: path.join(output, "failure.png") }).catch(() => {});
    throw error;
  } finally {
    if (context) await context.close();
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
