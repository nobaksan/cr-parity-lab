import { test } from "node:test";
import assert from "node:assert/strict";
import { format_money } from "../src/probe7s.js";

test("format_money applies US grouping to positive, negative and zero amounts", () => {
  for (const [value, expected] of [
    [0, "0"],
    [-0, "-0"],
    [12, "12"],
    [1000, "1,000"],
    [1234567.89, "1,234,567.89"],
    [-1234567.89, "-1,234,567.89"],
  ]) {
    assert.equal(format_money(value), expected);
  }
});

test("format_money preserves decimal digits beyond the default Intl limit", () => {
  assert.equal(format_money(0.0001), "0.0001");
  assert.equal(format_money(-0.0001), "-0.0001");
  assert.equal(format_money(1234.56789), "1,234.56789");
  assert.equal(format_money(0.1 + 0.2), "0.30000000000000004");
});

test("format_money preserves finite numbers at precision and magnitude boundaries", () => {
  for (const value of [
    Number.MIN_VALUE, -Number.MIN_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE,
    Number.MAX_SAFE_INTEGER, 1e21, 1e-21, 1.2345678901234567,
  ]) {
    const formatted = format_money(value);
    assert.match(formatted, /^-?\d{1,3}(?:,\d{3})*(?:\.\d+)?$/);
    assert.equal(Number(formatted.replaceAll(",", "")), value);
  }
});

test("format_money rejects nonnumbers and nonfinite numbers without coercion", () => {
  for (const value of [
    NaN, Infinity, -Infinity, "1234", "", null, undefined, true, false,
    [], {}, 1234n, Symbol("amount"), new Number(1234),
  ]) {
    assert.equal(format_money(value), null);
  }
});
