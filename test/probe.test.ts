import { test } from "node:test";
import assert from "node:assert/strict";
import type { Db } from "../src/db.ts";
import { findByEmail, makeResetToken } from "../src/probe.ts";

test("reset tokens differ for the same email at the same time and contain 32 bytes", t => {
  t.mock.timers.enable({ apis: ["Date"], now: 1_700_000_000_000 });
  const first = makeResetToken("user@example.com");
  const second = makeResetToken("user@example.com");
  assert.notEqual(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.match(second, /^[a-f0-9]{64}$/);
});

test("email lookup binds email as data and preserves database results", async () => {
  for (const email of ["user@example.com", "' OR 1=1 --", "O'Brien@example.com", ""]) {
    const rows = [{ id: 1, email }];
    const db: Db = {
      async query(sql, params) {
        assert.equal(sql, "SELECT * FROM users WHERE email = $1");
        assert.deepEqual(params, [email]);
        return rows;
      },
    };
    assert.equal(await findByEmail(db, email), rows);
  }
  assert.deepEqual(await findByEmail({ query: async () => [] }, "missing@example.com"), []);
});

test("email lookup propagates database failures", async () => {
  const failure = new Error("database lookup failed");
  const db: Db = { query: async () => { throw failure; } };
  await assert.rejects(findByEmail(db, "user@example.com"), error => error === failure);
});
