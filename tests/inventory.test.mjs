import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { quantitiesFor, refreshInterval } = createRequire(import.meta.url)("../js/inventory.js");
const product = { code: "7001", sizes: [{ size: "S" }, { size: "M" }] };

test("refresh interval is exactly 30 seconds", () => assert.equal(refreshInterval, 30000));

test("color code mapping keeps only local sizes and distinguishes unknown from zero", () => {
  const quantities = quantitiesFor({ product: "7001", variants: [
    { colorCode: "7001-01", size: "S", quantity: 0 },
    { colorCode: "7001-01", size: "M", quantity: 123 },
    { colorCode: "7001-01", size: "XS", quantity: 555 },
    { colorCode: "7001-02", size: "S", quantity: 999 }
  ] }, product, "7001-01");
  assert.deepEqual([...quantities], [["S", 0], ["M", 123]]);
  assert.equal(quantities.has("XS"), false);
});

test("invalid quantities and duplicates never become fabricated stock", () => {
  for (const quantity of [null, undefined, "100", -1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(quantitiesFor({ product: "7001", variants: [{ colorCode: "7001-01", size: "S", quantity }] }, product, "7001-01").get("S"), null);
  }
  const variants = [1, 2, 3].map((quantity) => ({ colorCode: "7001-01", size: "S", quantity }));
  assert.equal(quantitiesFor({ product: "7001", variants }, product, "7001-01").get("S"), null);
  assert.throws(() => quantitiesFor({ product: "03XA5", variants: [] }, product, "7001-01"));
  assert.throws(() => quantitiesFor({ product: "7001", variants: null }, product, "7001-01"));
});
