import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import i18n from "../js/i18n.js";

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(new URL("../data/products.js", import.meta.url), "utf8"), sandbox);
const products = sandbox.window.products;
const t = i18n.createTranslator(products);

test("first visit, invalid preference and unavailable storage default to Korean", () => {
  assert.equal(i18n.readLanguage(), "ko");
  assert.equal(i18n.readLanguage({ getItem: () => null }), "ko");
  assert.equal(i18n.readLanguage({ getItem: () => "zh" }), "ko");
  assert.equal(i18n.readLanguage({ getItem: () => { throw new Error("blocked"); } }), "ko");
  assert.equal(i18n.readLanguage({ getItem: () => "en" }), "en");
});

test("all catalog compositions keep every numeric percentage and support both languages", () => {
  for (const product of products) {
    const ko = t(product.fabric, "ko");
    assert.match(ko, /[가-힣]/, product.code);
    assert.doesNotMatch(ko, /Cotton|Polyester|Rayon|Spandex|Outer|Lining/);
    assert.deepEqual(ko.match(/\d+(?:\.\d+)?%/g), product.fabric.match(/\d+(?:\.\d+)?%/g), product.code);
    assert.equal(t(ko, "en"), product.fabric, product.code);
    assert.equal(t(product.name, "en"), product.nameEn, product.code);
    assert.equal(t(product.nameEn, "ko"), product.name, product.code);
  }
  assert.equal(t("Regular Fit", "ko"), "레귤러핏");
  assert.equal(t("Cotton 95% Span 5%", "ko"), "면 95% 스판 5%");
});

test("dynamic counts and image labels translate without changing model codes or size values", () => {
  for (const [en, ko] of [["22 Products", "제품 22개"], ["180G 12 Colors", "180G 12색상"], ["Model Fit 2", "모델 착용컷 2"], ["13 Page", "13페이지"]]) {
    assert.equal(t(en, "ko"), ko);
    assert.equal(t(ko, "en"), en);
  }
  for (const value of ["TH5611", "XS", "2XL", "95", "#FFFFFF"]) assert.equal(t(value, "ko"), value);
});

test("all public catalog pages expose the same language control before Home", () => {
  for (const page of ["index", "about", "products", "product-detail", "lookbook", "contact"]) {
    const html = readFileSync(new URL(`../${page}.html`, import.meta.url), "utf8");
    const nav = html.match(/<nav[\s\S]*?<\/nav>/)[0];
    assert.ok(nav.indexOf('data-language="ko"') < nav.indexOf('href="index.html"'), page);
    assert.match(nav, /aria-pressed="true" data-language="ko"/);
    assert.ok(html.indexOf('js/i18n.js') < html.indexOf('js/main.js'), page);
  }
});
