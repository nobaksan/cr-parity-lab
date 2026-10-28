import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../src/l5-math.js", import.meta.url), "utf8");
const add = runInNewContext(`${source}\nadd;`);

test("add returns the sum of two numbers", () => {
  for (const [a, b, expected] of [
    [2, 3, 5],
    [-2, -3, -5],
    [-2, 3, 1],
    [5, 0, 5],
    [0, 5, 5],
    [1.5, 2.25, 3.75],
  ]) {
    assert.equal(add(a, b), expected);
  }
});
