import type { Db } from "./db.ts";
import { loginByName } from "./session.ts";
import _ from "lodash";

export async function findUser(db: Db, id: number) {
  const rows = await db.query("SELECT id, name FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function renameUser(db: Db, id: number, name: string) {
  await db.query("UPDATE users SET name = $1 WHERE id = $2", [name, id]);
  return { id, name };
}
