const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const site = "https://www.tworldkorea.co.kr";
const api = "https://tworld-inventory-api.halestork64.chatgpt.site/stock";
const output = path.join(root, "outputs/inventory-qa");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/products.js"), "utf8"), sandbox);
const codes = sandbox.window.products.map((product) => product.code);

(async () => {
  // Never read the owner's keyword or bypass authentication for a production test.
  for (const code of codes) {
    const response = await fetch(`${api}?product=${code}`, { headers: { Origin: site } });
    assert.equal(response.status, 401);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.deepEqual(await response.json(), { error: "Authentication required" });
  }
  const forged = await fetch(`${api}?product=7001`, { headers: { Origin: site, Authorization: "Bearer invalid-token" } });
  assert.ok([401, 503].includes(forged.status));
  const preflight = await fetch(api, { method: "OPTIONS", headers: { Origin: site, "Access-Control-Request-Method": "GET", "Access-Control-Request-Headers": "authorization" } });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get("access-control-allow-headers"), /Authorization/i);
  console.log("PASS: production API rejects all public catalog lookups without authentication; forged tokens rejected and CORS preflight succeeds");

  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    // Local catalog files on the real origin; the actual API is never intercepted.
    if (process.env.INVENTORY_PREDEPLOY === "1") {
      for (const name of ["product-detail.html", "data/products.js", "data/inventory-config.js", "js/inventory.js", "js/main.js", "css/style.css", "images/icons/refresh-cw.svg"]) {
        await context.route(`${site}/${name}*`, (route) => route.fulfill({
          contentType: name.endsWith(".html") ? "text/html" : name.endsWith(".css") ? "text/css" : name.endsWith(".svg") ? "image/svg+xml" : "application/javascript",
          body: fs.readFileSync(path.join(root, name))
        }));
      }
    }
    const page = await context.newPage();
    const errors = [];
    let stockCalls = 0;
    let authCalls = 0;
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (!request.url().startsWith(api)) return;
      if (url.pathname === "/stock/auth") authCalls += 1;
      else stockCalls += 1;
    });
    for (const code of codes) {
      await page.goto(`${site}/product-detail.html?id=${code}`, { waitUntil: "load" });
      await page.locator(".sample-choice").first().click();
      const customOrder = await page.locator(".detail-main-image .custom-order-badge").count() > 0;
      if (customOrder) assert.equal(await page.locator("[data-stock-access], .size-stock, .stock-refresh, [data-stock-status]").count(), 0);
      else assert.equal(await page.locator(".sample-size-grid").getAttribute("data-stock-state"), "locked");
      assert.equal(await page.locator(".size-stock:visible").count(), 0);
      assert.equal(stockCalls, 0);
      if (code === "7001") assert.equal(await page.locator('input[name="sample-size"][value="XS"], input[data-color-code="7001-07"]').count(), 0);
      if (code === "23012") assert.equal(await page.locator('input[data-color-code="23012-06"], input[data-color-code="23012-07"]').count(), 0);
    }
    // An entire real polling interval while unauthenticated must cause no inventory traffic.
    await page.waitForTimeout(31000);
    assert.equal(stockCalls, 0);
    await page.getByRole("button", { name: "재고 확인", exact: true }).click();
    assert.equal(await page.locator("#stock-keyword").getAttribute("type"), "password");
    assert.equal(await page.locator("#stock-keyword").inputValue(), "");
    assert.equal(authCalls, 0);
    assert.equal(stockCalls, 0);
    for (const [name, viewport] of [["live-auth-desktop", { width: 1440, height: 1000 }], ["live-auth-mobile", { width: 390, height: 844 }]]) {
      await page.setViewportSize(viewport);
      await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled" });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.locator("dialog").evaluate((dialog) => { const box = dialog.getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth && dialog.scrollWidth <= dialog.clientWidth; }), true);
    }
    await page.keyboard.press("Escape");
    await page.locator(".sample-size-grid").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, "live-locked.png"), animations: "disabled" });
    await page.goto(`${site}/product-detail.html?id=3505`, { waitUntil: "load" });
    assert.equal(await page.locator("[data-stock-access]").count(), 1);
    assert.deepEqual(errors, []);
    console.log("PASS: real HTTPS/CORS keyword dialog; all products locked before auth; no inventory traffic across 31 seconds; responsive layout and hidden settings preserved");
    await context.close();
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
