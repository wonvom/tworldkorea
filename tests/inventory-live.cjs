const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const site = "https://www.tworldkorea.co.kr";
const api = "https://tworld-inventory-api.halestork64.chatgpt.site/stock";
const output = path.join(root, "outputs/inventory-qa");

async function until(check, label, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out: ${label}`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    // Preview local code on the real catalog origin; never intercept or fake the inventory API.
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
    const calls = [];
    const responses = new Map();
    const tasks = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("request", (request) => {
      if (request.url().startsWith(api)) {
        calls.push({ url: request.url(), at: Date.now() });
        assert.equal(request.headers().cookie, undefined);
      }
    });
    page.on("response", (response) => {
      if (!response.url().startsWith(api)) return;
      const task = (async () => {
        assert.equal(response.status(), 200);
        assert.equal(response.headers()["access-control-allow-origin"], site);
        assert.match(response.headers()["cache-control"], /no-store/);
        const data = await response.json();
        responses.set(data.product, data);
      })();
      tasks.push(task);
    });
    const waitReady = () => until(async () => await page.locator(".sample-size-grid").getAttribute("data-stock-state") === "ready", "real stock ready");
    for (const code of ["01OA1", "7001", "03XA5", "T210", "23012"]) {
      await page.goto(`${site}/product-detail.html?id=${code}`, { waitUntil: "load" });
      await page.locator(".sample-choice").first().click();
      await waitReady();
      await Promise.all(tasks);
      const color = await page.locator('input[name="sample-color"]:checked').getAttribute("data-color-code");
      const stock = responses.get(code).variants.find((entry) => entry.colorCode === color && entry.size === "S").quantity;
      assert.ok(Number.isSafeInteger(stock));
      assert.equal(await page.locator('[data-stock-size="S"]').textContent(), stock === 0 ? "품절 (0장)" : `${stock.toLocaleString("ko-KR")}장`);
      if (code === "7001") assert.equal(await page.locator('input[name="sample-size"][value="XS"], input[data-color-code="7001-07"]').count(), 0);
      if (code === "23012") assert.equal(await page.locator('input[data-color-code="23012-06"], input[data-color-code="23012-07"]').count(), 0);
      console.log(`PASS: real anonymous HTTPS/CORS inventory for ${code}`);
    }

    let before = calls.length;
    await page.locator(".sample-choice").first().click();
    await waitReady();
    assert.equal(calls.length, before + 1);
    before = calls.length;
    await page.locator(".sample-choice").nth(1).click();
    await waitReady();
    assert.equal(calls.length, before + 1);
    console.log("PASS: same-color re-click and color change each issue a new real API request");

    const started = calls[calls.length - 1].at;
    before = calls.length;
    await until(() => calls.length > before, "30-second real network refresh", 38000);
    const elapsed = calls[before].at - started;
    assert.ok(elapsed >= 28500 && elapsed <= 35000, `Unexpected refresh interval: ${elapsed}ms`);
    await waitReady();
    console.log(`PASS: real 30-second refresh (${elapsed}ms), without mocked clocks or API responses`);

    for (const [name, viewport] of [["live-desktop", { width: 1440, height: 1000 }], ["live-mobile", { width: 390, height: 844 }]]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(350);
      await page.locator(".sample-size-grid").scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled" });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.locator(".sample-size--stock").evaluateAll((labels) => labels.some((label) => label.scrollWidth > label.clientWidth)), false);
    }
    const unrelatedCalls = calls.length;
    await page.goto(`${site}/product-detail.html?id=3505`, { waitUntil: "load" });
    assert.equal(await page.locator("[data-stock-status]").count(), 0);
    assert.equal(calls.length, unrelatedCalls);
    await Promise.all(tasks);
    assert.deepEqual(errors, []);
    console.log("PASS: desktop/mobile layout, hidden settings and unrelated products preserved; no browser errors");
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
