import { test } from "node:test";
import assert from "node:assert/strict";
import { abs_one } from "../src/probe7r6.js";

test("abs_one returns positive zero for either signed zero", () => {
  assert.equal(abs_one(-0), 0);
  assert.equal(abs_one(0), 0);
});

test("abs_one handles finite numbers, infinities, and NaN", () => {
  for (const [input, expected] of [
    [-2.5, 2.5],
    [2.5, 2.5],
    [-Infinity, Infinity],
    [Infinity, Infinity],
    [NaN, NaN],
  ]) {
    assert.equal(abs_one(input), expected);
  }
});
