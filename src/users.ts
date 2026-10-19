import type { Db } from "./db.ts";

export async function findUser(db: Db, id: number) {
  const rows = await db.query("SELECT id, name FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}
