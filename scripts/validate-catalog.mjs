import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "data", "products.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const products = context.window.products || [];
const expected = ["TH5615", "TH9309", "XF8281", "TH96001", "TH5611"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const code of expected) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing catalog product ${code}`);
  assert(product.category === "Polo Shirt", `${code} should be in Polo Shirt category`);
  assert(product.colors.length >= 8, `${code} should include color variants from Excel`);
  assert(product.sizes.length >= 6, `${code} should include PDF size rows`);
  assert(fs.existsSync(path.join(root, product.thumbnail)), `${code} thumbnail file is missing`);
  assert(fs.existsSync(path.join(root, product.colors[0].image)), `${code} first color image is missing`);
}

assert(
  context.window.catalogSummary.categories.some((category) => category.name === "Polo Shirt" && category.count === expected.length),
  "Catalog summary should include five Polo Shirt products"
);

console.log(`Validated ${expected.length} new Polo Shirt products.`);
