import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import i18n from "../js/i18n.js";

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(new URL("../data/products.js", import.meta.url), "utf8"), sandbox);
const products = sandbox.window.products;
const t = i18n.createTranslator(products);

test('catalog image descriptions and color accessibility labels are English', () => {
  for (const product of products) {
    for (const suffix of ['대표 이미지','앞면 이미지','뒷면 이미지','모델 착용 이미지 1','확대 디테일 이미지 2','원단 봉제 디테일 3']) {
      const source = `${product.name} ${suffix}`;
      assert.doesNotMatch(t(source, 'en'), /[가-힣]/, source);
      assert.equal(t(source, 'ko'), source);
    }
    for (const color of product.colors || []) {
      assert.doesNotMatch(t(`${product.name} ${color.nameKr} 컬러 이미지`, 'en'), /[가-힣]/);
      assert.equal(t(`${color.nameKr} ${color.nameCn} ${color.nameEn}`, 'en'), color.nameEn);
    }
  }
  assert.equal(t('155cm 이하','en'),'155cm or less');
  assert.equal(t('35kg 이상','en'),'35kg or more');
});

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
    assert.ok(html.includes('js/i18n.js?v=20261103-bilingual-member'), page);
    const aboutLabels = [...html.matchAll(/<a href="about\.html">([^<]+)<\/a>/g)].map(match => match[1]);
    assert.ok(aboutLabels.length, page);
    for (const label of aboutLabels) {
      assert.equal(t(label, 'en'), 'ABOUT', page);
      assert.equal(t(label, 'ko'), label, page);
    }
  }
});

test("company overview copy and image descriptions are covered in English without changing Korean", () => {
  const html = readFileSync(new URL('../about.html', import.meta.url), 'utf8');
  const main = html.match(/<main>([\s\S]*?)<\/main>/)[1];
  const copy = [...main.matchAll(/<(?:p|h[1-6])[^>]*>([^<]+)<\//g)].map(match => match[1]);
  const imageDescriptions = [...main.matchAll(/\balt="([^"]+)"/g)].map(match => match[1]);
  assert.ok(copy.length >= 20);
  assert.equal(imageDescriptions.length, 3);
  for (const source of [...copy, ...imageDescriptions]) {
    assert.doesNotMatch(t(source, 'en'), /[가-힣]/, source);
    assert.equal(t(source, 'ko'), source);
  }
  assert.equal(t('ABOUT', 'ko'), '회사 소개');
  assert.equal(t('회사소개', 'en'), 'ABOUT');
});
