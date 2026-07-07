import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "data", "products.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const products = context.window.products || [];
const expectedPolo = [
  { code: "TH5615", pdfPage: 32, minColors: 8, minSizes: 6 },
  { code: "XF8281", pdfPage: 34, minColors: 8, minSizes: 6 },
  { code: "TH96001", pdfPage: 35, minColors: 8, minSizes: 6 },
  { code: "TH5611", pdfPage: 36, minColors: 8, minSizes: 6 },
  { code: "D0911", pdfPage: 37, minColors: 7, minSizes: 5 }
];
const expectedNewShortSleeves = [
  { code: "TH5618", pdfPage: 37, colors: 9, sizes: 7 },
  { code: "TH96003", pdfPage: 38, colors: 11, sizes: 7 },
  { code: "TH9310", pdfPage: 39, colors: 8, sizes: 6 },
  { code: "7111", pdfPage: 40, colors: 7, sizes: 7 }
];
const hidden = ["0E2700", "TH9309", "2408"];
const expectedWomenCropSizes = [
  { size: "S", chest: "40", shoulder: "33", length: "48" },
  { size: "M", chest: "42", shoulder: "34", length: "50" },
  { size: "L", chest: "44", shoulder: "35", length: "52" }
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const { code, pdfPage, minColors, minSizes } of expectedPolo) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing catalog product ${code}`);
  assert(product.category === "Polo Shirt", `${code} should be in Polo Shirt category`);
  assert(product.colors.length >= minColors, `${code} should include color variants from Excel`);
  assert(product.sizes.length >= minSizes, `${code} should include PDF size rows`);
  assert(product.pdfPage === pdfPage, `${code} should reference its PDF page`);
  assert(fs.existsSync(path.join(root, product.thumbnail)), `${code} thumbnail file is missing`);
  assert(fs.existsSync(path.join(root, product.colors[0].image)), `${code} first color image is missing`);
}

for (const { code, pdfPage, colors, sizes } of expectedNewShortSleeves) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing new short sleeve product ${code}`);
  assert(product.category === "Short Sleeve", `${code} should be in Short Sleeve category`);
  assert(product.colors.length === colors, `${code} should include ${colors} color rows from Excel`);
  assert(product.sizes.length === sizes, `${code} should include ${sizes} PDF size rows`);
  assert(product.pdfPage === pdfPage, `${code} should reference its PDF page`);
  assert(fs.existsSync(path.join(root, product.thumbnail)), `${code} thumbnail file is missing`);
  assert(fs.existsSync(path.join(root, product.colors[0].image)), `${code} first color image is missing`);
}

for (const code of hidden) {
  assert(!products.some((item) => item.code === code), `${code} should be hidden from visible products`);
}

for (const code of ["YL3200", "LM3200"]) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing visible product ${code}`);
  assert(product.fabric === "Cotton 87% Polyester 13%", `${code} should use updated fabric blend`);
}

for (const code of ["3505", "3508"]) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing visible product ${code}`);
  assert(product.fabric === "Cotton 80% Polyester 20%", `${code} should use updated fabric blend`);
}

const product7111 = products.find((item) => item.code === "7111");
assert(product7111, "Missing visible product 7111");
assert(
  JSON.stringify(product7111.sizes[0]) === JSON.stringify({
    size: "S",
    chest: "46",
    length: "64",
    shoulder: "39",
    height: "155-160cm",
    weight: "35-40kg"
  }),
  "7111 should include the requested S size as the first size row"
);

assert(source.includes('"size_TH9309", "basic", 33, []'), "TH9309 should reference its 26.06.11 PDF page");
assert(source.includes('"2408", "200G 여성 슬림핏 티셔츠"') && source.includes('"size_2406", "women", 15, []'), "2408 should keep the updated women crop size template while hidden");

for (const code of ["2406", "2405"]) {
  const product = products.find((item) => item.code === code);
  assert(product, `Missing visible women crop product ${code}`);
  assert(JSON.stringify(product.sizes) === JSON.stringify(expectedWomenCropSizes), `${code} should use corrected chest, shoulder, and length sizes`);
}

assert(
  fs.existsSync(path.join(root, "images/products/TH9309/polo image.jpg")),
  "Polo category image is missing"
);

assert(
  context.window.catalogSummary.categories.some((category) => category.name === "Polo Shirt" && category.count === expectedPolo.length),
  "Catalog summary should include five visible Polo Shirt products"
);

assert(
  context.window.catalogSummary.categories.some((category) => category.name === "Short Sleeve" && category.count === 17),
  "Catalog summary should include seventeen visible Short Sleeve products"
);

assert(
  context.window.catalogSummary.categories.some((category) => category.name === "Sweatshirt" && category.count === 3),
  "Catalog summary should include three visible Sweatshirt products"
);

console.log(`Validated ${expectedPolo.length} visible Polo Shirt products, ${expectedNewShortSleeves.length} new Short Sleeve products, and hidden ${hidden.join(", ")}.`);
