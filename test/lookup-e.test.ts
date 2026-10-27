import { test } from "node:test";
import assert from "node:assert/strict";
import type { Db } from "../src/db.ts";
import { find_user } from "../src/lookup-e.ts";

test("name lookup binds request input as data and preserves database results", async () => {
  for (const name of ["kim", "O'Brien", "' OR 1=1 --", "", "김동우"]) {
    const rows = [{ id: 1, name }];
    let calls = 0;
    const db: Db = {
      async query(sql, params) {
        calls += 1;
        assert.equal(sql, "SELECT * FROM users WHERE name = $1");
        assert.deepEqual(params, [name]);
        return rows;
      },
    };
    assert.equal(await find_user(db, { query: { name } }), rows);
    assert.equal(calls, 1);
  }
});

test("name lookup preserves an empty database result", async () => {
  const rows: Awaited<ReturnType<Db["query"]>> = [];
  const db: Db = { query: async () => rows };
  assert.equal(await find_user(db, { query: { name: "missing" } }), rows);
});

test("name lookup propagates database failures", async () => {
  const failure = new Error("database lookup failed");
  const db: Db = { query: async () => { throw failure; } };
  await assert.rejects(find_user(db, { query: { name: "kim" } }), error => error === failure);
});
