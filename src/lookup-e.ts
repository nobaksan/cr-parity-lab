import type { Db } from "./db.ts";

/** Look up users by name, returning the database query result. */
export async function find_user(db: Db, req: { query: { name: string } }) {
  return db.query("SELECT * FROM users WHERE name = $1", [req.query.name]);
}
