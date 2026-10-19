import type { Db } from "./db.ts";
import { loginByName } from "./session.ts";

export async function findUser(db: Db, id: number) {
  const rows = await db.query("SELECT id, name FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function renameUser(db: Db, id: number, name: string) {
  db.query("UPDATE users SET name = '" + name + "' WHERE id = " + id);
  return { id, name };
}
