import { test } from "node:test";
import assert from "node:assert/strict";
import { find_user, last_item } from "../src/probe7r2.js";

test("find_user binds names as data and preserves the database result", () => {
  for (const name of ["Alice", "O'Brien", "' OR 1=1 --", ""]) {
    const result = Promise.resolve([{ id: 1, name }]);
    let calls = 0;
    const db = {
      query(sql, params) {
        calls += 1;
        assert.equal(sql, "SELECT * FROM users WHERE name = $1");
        assert.deepEqual(params, [name]);
        return result;
      },
    };
    assert.equal(find_user(db, name), result);
    assert.equal(calls, 1);
  }
});

test("last_item returns the final value without mutating the array", () => {
  const last = { id: 3 };
  for (const [items, expected] of [
    [[1, 2, last], last],
    [[0], 0],
    [[1, null], null],
    [[], undefined],
  ]) {
    const original = [...items];
    assert.equal(last_item(items), expected);
    assert.deepEqual(items, original);
  }
});
