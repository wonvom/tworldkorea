import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "data", "products.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const products = context.window.products || [];
const expected = ["TH5615", "XF8281", "TH96001", "TH5611"];
const hidden = ["TH9309", "2408"];
const expectedPdfPages = new Map([
  ["TH5615", 32],
  ["XF8281", 34],
  ["TH96001", 35],
  ["TH5611", 36]
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const code of expected) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing catalog product ${code}`);
  assert(product.category === "Polo Shirt", `${code} should be in Polo Shirt category`);
  assert(product.colors.length >= 8, `${code} should include color variants from Excel`);
  assert(product.sizes.length >= 6, `${code} should include PDF size rows`);
  assert(product.pdfPage === expectedPdfPages.get(code), `${code} should reference its 26.06.11 PDF page`);
  assert(fs.existsSync(path.join(root, product.thumbnail)), `${code} thumbnail file is missing`);
  assert(fs.existsSync(path.join(root, product.colors[0].image)), `${code} first color image is missing`);
}

for (const code of hidden) {
  assert(!products.some((item) => item.code === code), `${code} should be hidden from visible products`);
}

assert(source.includes('"size_TH9309", "basic", 33, []'), "TH9309 should reference its 26.06.11 PDF page");

assert(
  fs.existsSync(path.join(root, "images/products/TH9309/polo image.jpg")),
  "Polo category image is missing"
);

assert(
  context.window.catalogSummary.categories.some((category) => category.name === "Polo Shirt" && category.count === expected.length),
  "Catalog summary should include four visible Polo Shirt products"
);

assert(
  context.window.catalogSummary.categories.some((category) => category.name === "Short Sleeve" && category.count === 13),
  "Catalog summary should include thirteen visible Short Sleeve products"
);

console.log(`Validated ${expected.length} visible Polo Shirt products and hidden ${hidden.join(", ")}.`);
