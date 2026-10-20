const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const base = "http://127.0.0.1:4173";
const output = path.join(root, "outputs/inventory-qa");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/products.js"), "utf8"), sandbox);
const products = JSON.parse(JSON.stringify(sandbox.window.products));
const codes = Object.fromEntries(products.map((product) => [product.code, true]));
const unavailable = new Set(["27012", "YL3200", "A23014", "CK280"]);
const inquiryProducts = new Set(["TH5615", "XF8281", "TH96001", "TH5611", "TH96003", "7111"]);
const customOrders = new Set(["27012", "A23014", "CK280", "LK3401", "YL3200", "LM3200", "QXX5200"]);
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
    const sizeQuantities = new Map();
    let apiCalls = 0;
    let authMode = "ok";
    let authTtl = 3600000;
    let authCalls = 0;
    let releaseHeld = null;
    const requests = [];
    const errors = [];
    const responses = new Map();
    const fixture = async (code) => {
      const product = productFor(code);
      if (unavailable.has(code)) return Response.json({ product: code, variants: [], availability: "unavailable" });
      const quantity = baseQuantity;
      const overrides = new Map(sizeQuantities);
      const held = mode === "delay";
      if (held) {
        mode = "ok";
        await new Promise((resolve) => { releaseHeld = resolve; });
      }
      if (mode === "unauthorized") return new Response("{}", { status: 401 });
      if (mode === "error") return new Response("{}", { status: 502 });
      const rows = product.colors.flatMap((color) => product.sizes.filter((size) => size.size !== "L").map(({ size }) => ({
        colorCode: color.code,
        size,
        quantity: overrides.has(size) ? overrides.get(size) : size === "M" ? 0 : quantity
      })));
      if (code === "7001") {
        rows.push({ ...rows[0], size: "XS", quantity: 12345 });
        rows.push({ ...rows[0], colorCode: "7001-07", quantity: 12345 });
      }
      if (code === "23012") {
        rows.push({ ...rows[0], colorCode: "23012-06", quantity: 12345 });
        rows.push({ ...rows[0], colorCode: "23012-07", quantity: 12345 });
      }
      return Response.json({ product: code, queriedAt: new Date().toISOString(), variants: rows,
        ...(inquiryProducts.has(code) ? { availability: "inquiry" } : {}) });
    };
    await context.route("**/data/inventory-config.js*", (route) => route.fulfill({
      contentType: "application/javascript",
      body: `window.inventoryConfig = { enabled: ${enabled}, endpoint: ${JSON.stringify(configEndpoint)} };`
    }));
    await context.route("**/api/stock?*", async (route) => {
      apiCalls += 1;
      requests.push(route.request().url());
      assert.equal(route.request().headers().authorization, "Bearer isolated-test-token");
      if (mode === "hang") {
        mode = "ok";
        await new Promise((resolve) => { releaseHeld = resolve; });
        await route.abort().catch(() => {});
        return;
      }
      const url = new URL(route.request().url());
      const response = await fixture(url.searchParams.get("product"));
      const body = await response.text();
      if (response.ok) responses.set(url.searchParams.get("product"), JSON.parse(body));
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body }).catch(() => {});
    });
    await context.route("**/api/stock/auth", async (route) => {
      authCalls += 1;
      assert.equal(route.request().method(), "POST");
      assert.equal(route.request().headers()["content-type"], "application/json");
      const keyword = route.request().postDataJSON().keyword;
      const status = authMode === "unconfigured" ? 503 : authMode === "limited" ? 429 : keyword === "test-keyword" ? 200 : 401;
      await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(status === 200 ? { token: "isolated-test-token", expiresAt: await page.evaluate(() => Date.now()) + authTtl } : { error: "Authentication failed" }) });
    });
    page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.clock.install({ time: new Date("2026-10-19T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-19T12:00:01Z"));
    const open = async (code) => {
      await page.goto(`${base}/product-detail.html?id=${code}`, { waitUntil: "domcontentloaded" });
      await until(async () => await page.locator(".sample-selector").count() === 1, "product render");
    };
    const choose = (code) => page.locator(`.sample-choice:has(input[data-color-code="${code}"])`).click();
    const state = () => page.locator(".sample-size-grid").getAttribute("data-stock-state");
    const text = (size) => page.locator(`[data-stock-size="${size}"]`).textContent();
    const sizeInput = (size) => page.locator(`input[name="sample-size"][value="${size}"]`);
    const chooseSize = (size) => page.locator(`.sample-size:has(input[value="${size}"])`).click();
    const ready = () => until(async () => await state() === "ready", "stock ready");
    const waitCalls = (count) => until(() => apiCalls === count, `API count ${count}`);
    const authenticate = async () => {
      await page.getByRole("button", { name: "재고 확인", exact: true }).click();
      await page.locator("#stock-keyword").fill("test-keyword");
      await page.locator(".stock-auth-submit").click();
      await until(async () => !(await page.locator("dialog").evaluate((dialog) => dialog.open)), "authentication dialog closed");
    };

    await open("7001");
    await choose("7001-01");
    assert.equal(await page.locator("[data-stock-status]").count(), 0);
    assert.equal(apiCalls, 0);
    console.log("PASS: production-disabled configuration leaves existing selector unchanged");

    enabled = true;
    for (const code of Object.keys(codes)) {
      await open(code);
      if (customOrders.has(code)) {
        const before = apiCalls;
        assert.equal(await page.locator(".detail-main-image .custom-order-badge").count(), 1);
        assert.equal(await page.locator("[data-stock-access], .size-stock, .stock-refresh, [data-stock-status]").count(), 0);
        await choose(productFor(code).colors[0].code);
        await page.clock.runFor(60000);
        assert.equal(apiCalls, before);
        continue;
      }
      assert.equal(await state(), "locked");
      const before = apiCalls;
      assert.equal(await page.locator('input[name="sample-color"]:checked').count(), 0);
      if (code === "7001") await choose("7001-02");
      await page.clock.runFor(60000);
      assert.equal(apiCalls, before);
      assert.equal(await page.locator(".size-stock:visible").count(), 0);
      if (code === "01OA1") {
        await page.getByRole("button", { name: "재고 확인", exact: true }).click();
        await page.locator("#stock-keyword").fill("wrong-keyword");
        await page.locator(".stock-auth-submit").click();
        await until(async () => (await page.locator("#stock-auth-error").textContent()).includes("키워드"), "wrong keyword rejected");
        assert.equal(apiCalls, before);
        assert.equal(await page.locator('input[name="sample-color"]:checked').count(), 0);
        assert.equal(await page.locator("#stock-keyword").inputValue(), "");
        await page.keyboard.press("Escape");
      }
      await authenticate();
      await ready();
      assert.equal(apiCalls, before + 1);
      assert.equal(await page.locator('input[name="sample-color"]:checked').getAttribute("data-color-code"), code === "7001" ? "7001-02" : productFor(code).colors[0].code);
      for (const { size } of productFor(code).sizes) {
        assert.equal(await text(size), inquiryProducts.has(code) ? "-" : unavailable.has(code) || size === "L" ? "확인 불가" : size === "M" ? "품절 (0장)" : "42장", `${code} ${size}`);
        assert.equal(await sizeInput(size).isDisabled(), !unavailable.has(code) && !inquiryProducts.has(code) && size === "M", `${code} ${size} selection`);
      }
      if (unavailable.has(code)) assert.match(await page.locator("[data-stock-status]").textContent(), /원본 재고 확인 불가/);
      if (inquiryProducts.has(code)) assert.match(await page.locator("[data-stock-status]").textContent(), /문의 상품/);
      assert.equal(await page.locator(".sample-size").count(), productFor(code).sizes.length);
      await page.getByRole("button", { name: "재고 숨기기", exact: true }).click();
      assert.equal(await state(), "locked");
      assert.equal(await page.locator('input[name="sample-size"]:disabled').count(), 0);
    }
    console.log("PASS: 38 regular products load their first color after authentication and preserve existing choices; 7 custom-order products have no stock UI/traffic; hidden settings preserved");

    await open("TH5611");
    await authenticate();
    await ready();
    for (const color of productFor("TH5611").colors) {
      await choose(color.code);
      await ready();
      for (const { size } of productFor("TH5611").sizes) {
        assert.equal(await text(size), "-");
        assert.equal(await sizeInput(size).isDisabled(), false);
      }
    }
    await page.locator(".sample-size-grid").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, "inquiry-TH5611.png") });
    console.log("PASS: all six inquiry products show dashes, including every TH5611 color/size; placeholder stock never marks them sold out");
    await page.getByRole("button", { name: "재고 숨기기", exact: true }).click();

    await open("7001");
    assert.equal(await page.locator('input[name="sample-size"][value="XS"]').count(), 0);
    assert.equal(await page.locator('input[data-color-code="7001-07"]').count(), 0);
    await page.locator('input[data-color-code="7001-01"]').evaluate((input) => { input.checked = true; });
    await choose("7001-01");
    await authenticate();
    await ready();
    await page.locator('.sample-size:has(input[value="M"])').click({ force: true });
    assert.equal(await sizeInput("M").isChecked(), false);
    await sizeInput("M").evaluate((input) => { input.checked = true; });
    await page.locator("[data-add-sample]").click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("tworld-sample-list-v1") || "[]").length), 0);
    await sizeInput("M").evaluate((input) => { input.checked = false; });
    await chooseSize("L");
    assert.equal(await sizeInput("L").isChecked(), true);
    await page.locator("[data-add-sample]").click();
    assert.equal(await state(), "idle");
    assert.equal(await page.locator('input[name="sample-size"]:disabled').count(), 0);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("tworld-sample-list-v1"))[0].size), "L");
    await page.evaluate(() => localStorage.removeItem("tworld-sample-list-v1"));
    await choose("7001-01");
    await ready();
    await chooseSize("S");
    baseQuantity = 0;
    await page.getByRole("button", { name: "재고 새로고침", exact: true }).click();
    await ready();
    assert.equal(await sizeInput("S").isDisabled(), true);
    assert.equal(await sizeInput("S").isChecked(), false);
    assert.match(await page.locator("[data-stock-status]").textContent(), /품절되어 선택이 해제/);
    baseQuantity = 42;
    sizeQuantities.set("M", 8);
    mode = "delay";
    await choose("7001-01");
    await until(() => Boolean(releaseHeld), "same-color refresh held");
    assert.equal(await state(), "loading");
    assert.equal(await sizeInput("S").isDisabled(), true);
    assert.equal(await text("S"), "품절 (0장)");
    assert.equal(await sizeInput("L").isDisabled(), false);
    releaseHeld();
    releaseHeld = null;
    await ready();
    assert.equal(await sizeInput("S").isDisabled(), false);
    assert.equal(await sizeInput("M").isDisabled(), false);
    assert.equal(await text("M"), "8장");
    sizeQuantities.clear();
    await choose("7001-01");
    await ready();
    await chooseSize("S");
    mode = "delay";
    await choose("7001-02");
    await until(() => Boolean(releaseHeld), "new-color refresh held");
    assert.equal(await sizeInput("M").isDisabled(), false);
    assert.equal(await text("M"), "조회 중");
    assert.equal(await sizeInput("S").isChecked(), true);
    releaseHeld();
    releaseHeld = null;
    await ready();
    assert.equal(await sizeInput("M").isDisabled(), true);
    console.log("PASS: zero stock blocks selection/cart, unknown stock stays selectable, refresh clears sold-out selections and recovery/color changes restore availability");
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
    assert.equal(await page.locator('input[name="sample-size"]:disabled').count(), 0);
    await chooseSize("M");
    assert.equal(await sizeInput("M").isChecked(), true);
    mode = "ok";
    await page.clock.runFor(30000);
    await ready();
    assert.equal(await text("S"), "999장");
    assert.equal(await sizeInput("M").isDisabled(), true);
    assert.equal(await sizeInput("M").isChecked(), false);
    mode = "hang";
    await choose("7001-02");
    await until(() => Boolean(releaseHeld), "hanging request");
    await page.clock.runFor(10000);
    await until(async () => await state() === "error", "request timeout");
    assert.equal(await text("S"), "확인 불가");
    assert.equal(await page.locator('input[name="sample-size"]:disabled').count(), 0);
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
    assert.equal(await sizeInput("M").isDisabled(), true);
    assert.equal(await text("M"), "품절 (0장)");
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
    assert.equal(await page.locator('input[name="sample-size"]:disabled').count(), 0);
    assert.equal(await page.locator('input[name="sample-color"]:checked').count(), 0);
    assert.equal(await text("S"), "-");
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("tworld-sample-list-v1"))[0].size), "S");
    before = apiCalls;
    await page.clock.runFor(60000);
    assert.equal(apiCalls, before);
    console.log("PASS: sample cart still works and clearing the selection stops refreshes");

    before = apiCalls;
    await open("23012");
    await ready();
    assert.equal(apiCalls, before + 1);
    assert.equal(await page.locator('input[name="sample-color"]:checked').getAttribute("data-color-code"), productFor("23012").colors[0].code);
    assert.equal(await page.getByRole("button", { name: "재고 숨기기", exact: true }).count(), 1);
    assert.equal(await page.evaluate(() => localStorage.getItem("tworld-stock-session-v1:http://127.0.0.1:4173")), null);
    assert.equal(await page.locator('input[data-color-code="23012-06"], input[data-color-code="23012-07"]').count(), 0);
    console.log("PASS: restored tab authentication automatically selects and loads the first visible color on navigation");
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

    mode = "unauthorized";
    await choose("23012-02");
    await until(async () => await state() === "locked", "API rejects expired token");
    assert.equal(await page.locator(".size-stock:visible").count(), 0);
    before = apiCalls;
    await page.clock.runFor(60000);
    await choose("23012-02");
    assert.equal(apiCalls, before);
    mode = "ok";
    for (const value of ["unconfigured", "limited"]) {
      authMode = value;
      await page.getByRole("button", { name: "재고 확인", exact: true }).click();
      await page.locator("#stock-keyword").fill("test-keyword");
      await page.locator(".stock-auth-submit").click();
      await until(async () => Boolean(await page.locator("#stock-auth-error").textContent()), "auth failure visible");
      assert.equal(await state(), "locked");
      assert.equal(apiCalls, before);
      for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
        await page.setViewportSize(viewport);
        assert.equal(await page.locator("dialog").evaluate((dialog) => { const box = dialog.getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth && dialog.scrollWidth <= dialog.clientWidth; }), true);
      }
      await page.screenshot({ path: path.join(output, `auth-${value}.png`) });
      await page.keyboard.press("Escape");
    }
    authMode = "ok";
    authTtl = 1000;
    await authenticate();
    await ready();
    await page.clock.runFor(1000);
    assert.equal(await state(), "locked");
    assert.equal(await page.locator('input[name="sample-size"]:disabled').count(), 0);
    assert.equal(await page.locator(".size-stock:visible").count(), 0);
    assert.equal(await page.evaluate(() => sessionStorage.getItem("tworld-stock-session-v1:http://127.0.0.1:4173")), null);
    console.log("PASS: tab session survives navigation; server rejection/expiry removes stock and stops polling; unconfigured and throttled auth stays locked");

    before = apiCalls;
    await open("3505");
    assert.equal(await page.locator("[data-stock-access]").count(), 1);
    await page.locator(".sample-choice").first().click();
    await page.clock.runFor(60000);
    assert.equal(apiCalls, before);
    authTtl = 3600000;
    await authenticate();
    await ready();
    assert.equal(apiCalls, before + 1);
    console.log("PASS: previously unsupported products now use the same protected inventory flow");
    for (const code of customOrders) {
      before = apiCalls;
      await open(code);
      await page.locator(".sample-choice").first().click();
      await page.clock.runFor(60000);
      assert.equal(await page.locator("[data-stock-access], .size-stock, .stock-refresh, [data-stock-status]").count(), 0);
      assert.equal(apiCalls, before);
    }
    console.log("PASS: custom-order stock remains absent even with a valid authenticated session");

    configEndpoint = "https://[invalid";
    await open("7001");
    assert.equal(await page.locator("[data-stock-status]").count(), 0);
    assert.equal(await page.locator("[data-add-sample]").count(), 1);
    configEndpoint = "/api/stock";
    console.log("PASS: invalid relay configuration does not break the existing catalog");

    assert.ok(authCalls >= 8);
    assert.deepEqual(errors, []);
    assert.ok(requests.every((url) => Object.hasOwn(codes, new URL(url).searchParams.get("product"))));
    console.log("PASS: no uncaught browser errors; only public catalog models were requested");
  } catch (error) {
    if (page) await page.screenshot({ path: path.join(output, "failure.png") }).catch(() => {});
    throw error;
  } finally {
    if (context) await context.close();
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
