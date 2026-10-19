import crypto from "node:crypto";

// 증분 리뷰 실측용 — 의도적인 결함 두 개
export function makeResetToken(email: string) {
  // 결함 1: 예측 가능한 값 + 취약한 해시
  return crypto.createHash("md5").update(email + Date.now()).digest("hex");
}

export async function findByEmail(db: { query(sql: string): Promise<unknown[]> }, email: string) {
  // 결함 2: 문자열 연결 SQL
  return db.query("SELECT * FROM users WHERE email = '" + email + "'");
}
