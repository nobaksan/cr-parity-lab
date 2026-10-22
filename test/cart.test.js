import { test } from "node:test";
import assert from "node:assert/strict";
import { add_item, cart_total, apply_discount } from "../src/cart.js";

test("add_item adds new items or increases quantity for existing items", () => {
  let cart = [];
  // Add first item
  add_item(cart, { name: "apple", price: 1000, qty: 2 });
  assert.deepStrictEqual(cart, [{ name: "apple", price: 1000, qty: 2 }]);

  // Add same item, quantity should increase
  add_item(cart, { name: "apple", price: 1000, qty: 3 });
  assert.deepStrictEqual(cart, [{ name: "apple", price: 1000, qty: 5 }]);

  // Add different item
  add_item(cart, { name: "banana", price: 500 });
  assert.deepStrictEqual(cart, [{ name: "apple", price: 1000, qty: 5 }, { name: "banana", price: 500, qty: 1 }]);

  // Add item with default quantity
  cart = [];
  add_item(cart, { name: "orange", price: 2000 });
  assert.deepStrictEqual(cart, [{ name: "orange", price: 2000, qty: 1 }]);
});

test("add_item throws error for invalid item properties", () => {
  let cart = [];
  assert.throws(() => add_item(cart, null), TypeError, "item is required");
  assert.throws(() => add_item(cart, { price: 1000, qty: 1 }), TypeError, "item.name is required");
  assert.throws(() => add_item(cart, { name: "", price: 1000, qty: 1 }), TypeError, "item.name is required");
  assert.throws(() => add_item(cart, { name: "test", price: -100, qty: 1 }), RangeError, "item.price must be non-negative");
  assert.throws(() => add_item(cart, { name: "test", price: 100.5, qty: 1 }), RangeError, "item.price must be integer");
  assert.throws(() => add_item(cart, { name: "test", price: 100, qty: 0 }), RangeError, "item.qty must be positive");
  assert.throws(() => add_item(cart, { name: "test", price: 100, qty: -1 }), RangeError, "item.qty must be positive");
  assert.throws(() => add_item(cart, { name: "test", price: 100, qty: 1.5 }), RangeError, "item.qty must be integer");
});

test("cart_total calculates the correct total amount", () => {
  const cart1 = [];
  assert.strictEqual(cart_total(cart1), 0);

  const cart2 = [
    { name: "apple", price: 1000, qty: 2 },
    { name: "banana", price: 500, qty: 3 },
  ];
  assert.strictEqual(cart_total(cart2), 1000 * 2 + 500 * 3);

  const cart3 = [
    { name: "item1", price: 0, qty: 5 },
    { name: "item2", price: 100, qty: 0 }, // Should not happen based on add_item, but test robustness
  ];
  assert.strictEqual(cart_total(cart3), 0);
});

test("apply_discount calculates discounted total correctly", () => {
  assert.strictEqual(apply_discount(10000, 10), 9000); // 10% discount
  assert.strictEqual(apply_discount(10000, 0), 10000); // 0% discount
  assert.strictEqual(apply_discount(10000, 100), 0); // 100% discount
  assert.strictEqual(apply_discount(9999, 10), 9000); // Rounding up 8999.1
  assert.strictEqual(apply_discount(1000, 30), 700); // Exact
  assert.strictEqual(apply_discount(100, 33), 67); // Rounding 67.0
  assert.strictEqual(apply_discount(1, 1), 1); // Rounding 0.99
  assert.strictEqual(apply_discount(100, 0.5), 100); // Rounding 99.5
});

test("apply_discount throws error for invalid total or percent", () => {
  assert.throws(() => apply_discount(-100, 10), RangeError, "total must be non-negative");
  assert.throws(() => apply_discount(100, -1), RangeError, "percent must be between 0 and 100");
  assert.throws(() => apply_discount(100, 101), RangeError, "percent must be between 0 and 100");
  assert.throws(() => apply_discount(100, "10"), RangeError, "percent must be a number");
  assert.throws(() => apply_discount(100.5, 10), RangeError, "total must be integer");
});
