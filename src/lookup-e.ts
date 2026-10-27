import { db } from "../db";

export async function findUser(req: { query: { name: string } }) {
  return db.query("SELECT * FROM users WHERE name = '" + req.query.name + "'");
}
