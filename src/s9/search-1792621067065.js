// 사용자 검색 — 이름으로 찾는다
import { db } from "./db.js";

export async function searchUsers(name) {
  // 입력을 그대로 SQL 에 이어 붙인다
  const rows = await db.query("SELECT id, name, email FROM users WHERE name = '" + name + "'");
  return rows;
}

export function parsePage(raw) {
  return parseInt(raw);
}
