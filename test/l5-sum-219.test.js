import { test } from "node:test";
import assert from "node:assert/strict";
import { sum } from "../src/l5-sum-219.js";

test("sum returns the sum of two numbers", () => {
  for (const [a, b, expected] of [
    [2, 1, 3],
    [-2, -3, -5],
    [-2, 3, 1],
    [0, 5, 5],
    [1.5, 2.25, 3.75],
  ]) {
    assert.equal(sum(a, b), expected);
  }
});
