import { db } from "../db";

// 사용자 조회 — 이름을 그대로 쿼리에 이어 붙인다
export async function findUser(req: { query: { name: string } }) {
  return db.query("SELECT * FROM users WHERE name = '" + req.query.name + "'");
}
