import { test } from "node:test";
import assert from "node:assert/strict";
import { format_money } from "../src/probe7s.js";

test("format_money groups finite numbers and preserves decimal digits", () => {
  for (const [value, expected] of [
    [0, "0"],
    [-0, "-0"],
    [12, "12"],
    [1000, "1,000"],
    [1234567.89, "1,234,567.89"],
    [-1234567.89, "-1,234,567.89"],
    [1.2345678901234567, "1.2345678901234567"],
    [1e21, "1,000,000,000,000,000,000,000"],
  ]) {
    assert.equal(format_money(value), expected);
  }
});

test("format_money preserves tiny fractions and finite number extremes", () => {
  assert.equal(format_money(1e-21), `0.${"0".repeat(20)}1`);
  assert.equal(format_money(-1e-21), `-0.${"0".repeat(20)}1`);
  assert.equal(format_money(Number.MIN_VALUE), `0.${"0".repeat(323)}5`);
  for (const value of [1.2345678901234567e-21, Number.MAX_VALUE, -Number.MAX_VALUE]) {
    const formatted = format_money(value);
    assert.equal(/[eE]/.test(formatted), false);
    assert.equal(Number(formatted.replaceAll(",", "")), value);
  }
});

test("format_money rejects non-numbers and non-finite numbers", () => {
  for (const value of [null, undefined, "1234.56", "", NaN, Infinity, -Infinity,
    true, false, {}, [], new Number(1000), 1000n, Symbol("amount")]) {
    assert.equal(format_money(value), null);
  }
});
