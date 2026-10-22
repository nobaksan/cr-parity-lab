import { test } from "node:test";
import assert from "node:assert/strict";
import { add } from "../src/s13.js";

test("add returns the sum of two numbers", () => {
  for (const [a, b, expected] of [
    [2, 2, 4],
    [3, 5, 8],
    [-3, 5, 2],
    [-3, -5, -8],
    [0, 5, 5],
    [1.25, 2.5, 3.75],
  ]) {
    assert.equal(add(a, b), expected);
  }
});
