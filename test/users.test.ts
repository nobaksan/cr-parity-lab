import { test } from "node:test";
import assert from "node:assert/strict";
import { memoryDb } from "../src/db.ts";
import type { Db, Row } from "../src/db.ts";
import { findUser, renameUser } from "../src/users.ts";

test("findUser 는 첫 행을 돌려준다", async () => {
  const db = memoryDb([{ id: 1, name: "kim" }]);
  assert.deepEqual(await findUser(db, 1), { id: 1, name: "kim" });
});

test("rename binds name and ID and waits for the database update", async () => {
  const name = "O'Brien'; DROP TABLE users; --";
  const id = "1 OR 1=1" as unknown as number;
  let finish!: (rows: Row[]) => void;
  const db: Db = {
    query(sql, params) {
      assert.equal(sql, "UPDATE users SET name = $1 WHERE id = $2");
      assert.deepEqual(params, [name, id]);
      return new Promise(resolve => { finish = resolve; });
    },
  };
  let settled = false;
  const result = renameUser(db, id, name).then(value => {
    settled = true;
    return value;
  });
  await Promise.resolve();
  assert.equal(settled, false);
  finish([]);
  assert.deepEqual(await result, { id, name });
});

test("rename propagates database failures", async () => {
  const failure = new Error("database update failed");
  const db: Db = { query: async () => { throw failure; } };
  await assert.rejects(renameUser(db, 1, "kim"), error => error === failure);
});
