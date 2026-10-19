import type { Db } from "./db.ts";

/** Find a user by ID, returning null when no row exists. */
export async function findUser(db: Db, id: number) {
  const rows = await db.query("SELECT id, name FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

/** Rename a user, resolving only after the database update succeeds. */
export async function renameUser(db: Db, id: number, name: string) {
  await db.query("UPDATE users SET name = $1 WHERE id = $2", [name, id]);
  return { id, name };
}
