import crypto from "node:crypto";
import type { Db } from "./db.ts";

/** Generate a random reset credential. Callers own hashed storage, identity binding, expiry, and single use. */
export function makeResetToken(_email: string) {
  return crypto.randomBytes(32).toString("hex");
}

/** Look up users while keeping email separate from executable SQL. */
export async function findByEmail(db: Db, email: string) {
  return db.query("SELECT * FROM users WHERE email = $1", [email]);
}
