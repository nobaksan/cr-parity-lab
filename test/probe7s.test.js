import { test } from "node:test";
import assert from "node:assert/strict";
import { format_money } from "../src/probe7s.js";

test("format_money groups positive and negative integers by thousands", () => {
  for (const [value, expected] of [
    [0, "0"],
    [-0, "0"],
    [12, "12"],
    [999, "999"],
    [1000, "1,000"],
    [1234567, "1,234,567"],
    [-1234567, "-1,234,567"],
    [Number.MAX_SAFE_INTEGER, "9,007,199,254,740,991"],
  ]) {
    assert.equal(format_money(value), expected);
  }
});

test("format_money preserves fractional digits while grouping the integer part", () => {
  for (const [value, expected] of [
    [1.2345, "1.2345"],
    [1234567.8901234, "1,234,567.8901234"],
    [-1234.56789, "-1,234.56789"],
    [0.0001234, "0.0001234"],
  ]) {
    assert.equal(format_money(value), expected);
  }
});

test("format_money expands large exponent values before grouping", () => {
  for (const [value, expected] of [
    [1e20, "100,000,000,000,000,000,000"],
    [1e21, "1,000,000,000,000,000,000,000"],
    [-1e21, "-1,000,000,000,000,000,000,000"],
    [1.2345678901234568e21, "1,234,567,890,123,456,800,000"],
    [Number.MAX_VALUE, "179,769,313,486,231,570" + ",000".repeat(97)],
  ]) {
    assert.equal(format_money(value), expected);
  }
});

test("format_money expands small exponent values without rounding", () => {
  for (const [value, expected] of [
    [1e-6, "0.000001"],
    [1e-7, "0.0000001"],
    [-1e-7, "-0.0000001"],
    [1.2345e-7, "0.00000012345"],
    [Number.MIN_VALUE, "0." + "0".repeat(323) + "5"],
  ]) {
    assert.equal(format_money(value), expected);
  }
});

test("format_money returns null for non-numbers and non-finite numbers", () => {
  for (const value of [
    "abc", "1234567", "", null, undefined, NaN, Infinity, -Infinity,
    true, false, {}, [], new Number(1234), 1234n, Symbol("amount"),
    { toString() { throw new Error("input must not be coerced"); } },
  ]) {
    assert.equal(format_money(value), null);
  }
});
