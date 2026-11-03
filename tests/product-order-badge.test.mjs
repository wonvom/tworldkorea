import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import i18n from "../js/i18n.js";

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const source = read("js/main.js");
const rules = source.slice(source.indexOf("  const customOrderProductCodes"), source.indexOf("  function escapeHtml"));
const context = { window: {} };
vm.runInNewContext(read("data/products.js"), context);
const products = context.window.products;
const badge = vm.runInNewContext(`${rules}; productOrderBadge`, {});

test("TH, XF and 7111 show the minimum quantity while all other catalog badges stay unchanged", () => {
  const expected = ["TH5611", "TH5615", "TH5618", "TH9310", "TH96001", "TH96003", "XF8281", "7111"].sort();
  const actual = [];
  const customCodes = new Set(["27012", "A23014", "CK280", "LK3401", "YL3200", "LM3200", "QXX5200"]);
  for (const product of products) {
    const html = badge(product);
    if (/^(TH|XF)/.test(product.code) || product.code === "7111") {
      assert.equal(html, '<span class="custom-order-badge">최소 100장</span>', product.code);
      actual.push(product.code);
    } else {
      const custom = product.category === "Pants" || customCodes.has(product.code);
      assert.equal(html, custom ? '<span class="custom-order-badge">주문제작</span>' : "", product.code);
    }
  }
  assert.deepEqual(actual.sort(), expected);
  assert.match(badge({ code: " th9999 " }), /최소 100장/);
  assert.match(badge({ code: "xf9999" }), /최소 100장/);
  for (const code of ["71110", "7111-KIDS", "ATH5611", "01OA1", undefined]) {
    assert.equal(badge({ code }), "");
  }
});

test("catalog cards and detail photos use the same badge and translate it in both languages", () => {
  assert.equal(source.match(/const customOrderBadge = productOrderBadge\(product\);/g)?.length, 2);
  const cardCode = source.slice(source.indexOf("  function productCard("), source.indexOf("  function renderFeaturedProducts("));
  const html = vm.runInNewContext(`${rules}\n${cardCode}; productCard(product)`, {
    product: products.find((product) => product.code === "TH5611"),
    categoryLabel: () => ({ kr: "카라티" }), escapeHtml: String, assetUrl: String
  });
  assert.match(html, /<span class="image-frame"[^>]*>\s*<span class="custom-order-badge">최소 100장<\/span>/);
  const translate = i18n.createTranslator(products);
  assert.equal(translate("최소 100장", "en"), "Minimum 100 pieces");
  assert.equal(translate("Minimum 100 pieces", "ko"), "최소 100장");
  for (const page of ["index", "products", "product-detail", "about", "lookbook", "contact"]) {
    const html = read(`${page}.html`);
    assert.match(html, /js\/main.js\?v=20261103-minimum-order/);
    assert.match(html, /js\/i18n.js\?v=20261103-about-translation/);
  }
});
