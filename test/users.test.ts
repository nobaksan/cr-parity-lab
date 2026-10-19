import { test } from "node:test";
import assert from "node:assert/strict";
import { memoryDb } from "../src/db.ts";
import { findUser } from "../src/users.ts";

test("findUser 는 첫 행을 돌려준다", async () => {
  const db = memoryDb([{ id: 1, name: "kim" }]);
  assert.deepEqual(await findUser(db, 1), { id: 1, name: "kim" });
});
