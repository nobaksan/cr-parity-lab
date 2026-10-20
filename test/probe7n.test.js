import { test } from "node:test";
import assert from "node:assert/strict";
import { last_item, remove_at } from "../src/probe7n.js";

test("last_item returns the final value without changing the list", () => {
  const value = { id: 1 };
  for (const items of [[], [value], ["first", value], [1, 0], [1, undefined]]) {
    const original = items.slice();
    const expected = items.length ? original.at(-1) : undefined;
    assert.equal(last_item(items), expected);
    assert.deepEqual(items, original);
  }
});

test("remove_at removes the first, middle, or last item in place and returns the length", () => {
  const first = { id: 1 };
  const middle = { id: 2 };
  const last = { id: 3 };
  for (const [index, expected] of [
    [0, [middle, last]],
    [1, [first, last]],
    [2, [first, middle]],
  ]) {
    const items = [first, middle, last];
    assert.equal(remove_at(items, index), 2);
    assert.deepEqual(items, expected);
    expected.forEach((value, i) => assert.equal(items[i], value));
  }
  const singleton = [first];
  assert.equal(remove_at(singleton, 0), 0);
  assert.deepEqual(singleton, []);
});

test("remove_at leaves empty lists and invalid indices unchanged", () => {
  for (const original of [[], ["a", "b", "c"]]) {
    for (const index of [-1, 0.5, NaN, Infinity, -Infinity, original.length,
      original.length + 2, "1", undefined, null]) {
      const items = original.slice();
      assert.equal(remove_at(items, index), original.length);
      assert.deepEqual(items, original);
      assert.deepEqual(Object.keys(items), Object.keys(original));
    }
  }
});
