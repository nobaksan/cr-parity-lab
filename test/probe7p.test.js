import { test } from "node:test";
import assert from "node:assert/strict";
import { last_item, remove_at } from "../src/probe7p.js";

test("last_item returns the final value without mutating the array", () => {
  const last = { id: 3 };
  const items = [1, 2, last];
  assert.equal(last_item(items), last);
  assert.deepEqual(items, [1, 2, last]);
  assert.equal(last_item([0]), 0);
  assert.equal(last_item([1, null]), null);
  assert.equal(last_item([]), undefined);
});

test("remove_at removes exactly the requested item and returns the new length", () => {
  for (const [index, expected] of [
    [0, [2, 3]],
    [1, [1, 3]],
    [2, [1, 2]],
  ]) {
    const items = [1, 2, 3];
    assert.equal(remove_at(items, index), 2);
    assert.deepEqual(items, expected);
  }
  const singleton = [1];
  assert.equal(remove_at(singleton, 0), 0);
  assert.deepEqual(singleton, []);
});

test("remove_at leaves empty arrays and invalid indices unchanged", () => {
  for (const original of [[], [1, 2, 3]]) {
    for (const index of [-1, original.length, original.length + 1, 0.5, NaN,
      Infinity, -Infinity, "1", null, undefined]) {
      const items = [...original];
      assert.equal(remove_at(items, index), original.length);
      assert.deepEqual(items, original);
    }
  }
});

test("remove_at preserves holes when shifting sparse arrays", () => {
  const items = [1, , 3, , 5];
  assert.equal(remove_at(items, 0), 4);
  assert.deepEqual(items, [, 3, , 5]);
});
