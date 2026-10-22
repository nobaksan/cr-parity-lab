import { test } from "node:test";
import assert from "node:assert/strict";
import { find_user } from "../src/probe7m.js";

test("name lookup binds input as data and preserves database results", async () => {
  for (const name of ["Ada", "O'Brien", "' OR 1=1 --", ""]) {
    const rows = [{ id: 1, name }];
    const db = {
      async query(sql, params) {
        assert.equal(sql, "SELECT * FROM users WHERE name = $1");
        assert.deepEqual(params, [name]);
        return rows;
      },
    };
    assert.equal(await find_user(db, name), rows);
  }
});
