
import { test } from "node:test";
import assert from "node:assert/strict";
import { add_item, cart_total, apply_discount } from "../src/cart.js";

test("add_item adds new item to cart", () => {
  const cart = [];
  const item = { name: "apple", price: 1000, qty: 2 };
  add_item(cart, item);
  assert.deepEqual(cart, [{ name: "apple", price: 1000, qty: 2 }]);
});

test("add_item increments quantity for existing item", () => {
  const cart = [{ name: "apple", price: 1000, qty: 2 }];
  const item = { name: "apple", price: 1000, qty: 3 };
  add_item(cart, item);
  assert.deepEqual(cart, [{ name: "apple", price: 1000, qty: 5 }]);
});

test("add_item adds item with default quantity 1", () => {
  const cart = [];
  const item = { name: "orange", price: 1500 };
  add_item(cart, item);
  assert.deepEqual(cart, [{ name: "orange", price: 1500, qty: 1 }]);
});

test("add_item throws TypeError for missing or invalid item name", () => {
  const cart = [];
  assert.throws(() => add_item(cart, { price: 1000, qty: 1 }), TypeError, "item.name is required");
  assert.throws(() => add_item(cart, { name: "", price: 1000, qty: 1 }), TypeError, "item.name is required");
  assert.throws(() => add_item(cart, { name: 123, price: 1000, qty: 1 }), TypeError, "item.name is required");
});

test("add_item throws RangeError for invalid item price", () => {
  const cart = [];
  assert.throws(() => add_item(cart, { name: "apple", price: -100, qty: 1 }), RangeError, "item.price must be a non-negative integer");
  assert.throws(() => add_item(cart, { name: "apple", price: 100.5, qty: 1 }), RangeError, "item.price must be a non-negative integer");
});

test("add_item throws RangeError for invalid item quantity", () => {
  const cart = [];
  assert.throws(() => add_item(cart, { name: "apple", price: 1000, qty: 0 }), RangeError, "item.qty must be a positive integer");
  assert.throws(() => add_item(cart, { name: "apple", price: 1000, qty: -1 }), RangeError, "item.qty must be a positive integer");
  assert.throws(() => add_item(cart, { name: "apple", price: 1000, qty: 1.5 }), RangeError, "item.qty must be a positive integer");
});

test("cart_total calculates total for empty cart", () => {
  const cart = [];
  assert.equal(cart_total(cart), 0);
});

test("cart_total calculates total for single item", () => {
  const cart = [{ name: "apple", price: 1000, qty: 2 }];
  assert.equal(cart_total(cart), 2000);
});

test("cart_total calculates total for multiple items", () => {
  const cart = [
    { name: "apple", price: 1000, qty: 2 },
    { name: "orange", price: 1500, qty: 1 },
  ];
  assert.equal(cart_total(cart), 3500);
});

test("apply_discount calculates discounted total", () => {
  assert.equal(apply_discount(10000, 10), 9000);
  assert.equal(apply_discount(10000, 0), 10000);
  assert.equal(apply_discount(10000, 100), 0);
  assert.equal(apply_discount(9999, 10), 9000); // 8999.1 -> 9000
  assert.equal(apply_discount(100, 33), 67); // 67
  assert.equal(apply_discount(100, 33.3), 67); // 66.7 -> 67
});

test("apply_discount throws RangeError for invalid total", () => {
  assert.throws(() => apply_discount(-100, 10), RangeError, "total must be a non-negative integer");
  assert.throws(() => apply_discount(100.5, 10), RangeError, "total must be a non-negative integer");
});

test("apply_discount throws RangeError for invalid percent", () => {
  assert.throws(() => apply_discount(100, -10), RangeError, "percent must be between 0 and 100");
  assert.throws(() => apply_discount(100, 101), RangeError, "percent must be between 0 and 100");
  assert.throws(() => apply_discount(100, "abc"), RangeError, "percent must be between 0 and 100");
});
