import { test } from "node:test";
import assert from "node:assert/strict";
import { calc_shipping, total_with_shipping } from "../src/shipping12c.js";

test("shipping preserves zone rates and strict weight boundaries", () => {
  for (const [zone, base_fee] of [["A", 3000], ["B", 4000], ["C", 5000], ["D", 6000]]) {
    for (const [weight, surcharge] of [[0, 0], [5, 0], [5.01, 1000], [10, 1000], [10.01, 2000]]) {
      assert.equal(calc_shipping(weight, zone, false), base_fee + surcharge);
      assert.equal(calc_shipping(weight, zone, true), (base_fee + surcharge) * 2);
    }
  }
});

test("only boolean true enables express shipping", () => {
  for (const express of [false, undefined, null, 0, 1, "true", "false", {}, []]) {
    assert.equal(calc_shipping(6, "A", express), 4000);
  }
});

test("order totals use quantities for both price and weight without mutating items", () => {
  const items = Object.freeze([
    Object.freeze({ price: 1200, qty: 2, weight: 2.5 }),
    Object.freeze({ price: 800, qty: 3, weight: 0.1 }),
  ]);
  assert.equal(total_with_shipping(items, "A", false), 8800);
  assert.equal(total_with_shipping(items, "A", true), 12800);
  assert.equal(total_with_shipping([{ price: 100, qty: 2, weight: 6 }], "B", false), 6200);
  assert.equal(total_with_shipping([{ price: 100, qty: 1, weight: 0 }], "A", false), 3100);
});

test("empty carts have zero total in every shipping zone and express mode", () => {
  for (const zone of ["A", "B", "C", "D"]) {
    for (const express of [false, true]) {
      assert.equal(total_with_shipping([], zone, express), 0);
    }
  }
});

test("invalid or missing item weights are rejected before shipping is calculated", () => {
  const valid_item = Object.freeze({ price: 100, qty: 1, weight: 12 });
  for (const weight of [undefined, null, NaN, Infinity, -Infinity, -1, "12", "", true, {}, []]) {
    const invalid_item = Object.freeze({ price: 100, qty: 1, weight });
    for (const items of [[invalid_item], [valid_item, invalid_item]]) {
      assert.throws(() => total_with_shipping(items, "A", false), {
        name: "TypeError",
        message: "Item weight must be a finite, nonnegative number",
      });
    }
  }
  assert.throws(() => total_with_shipping([{ price: 100, qty: 1 }], "A", false), TypeError);
});
