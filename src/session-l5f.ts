import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "../db";

const SECRET = process.env.SESSION_SECRET ?? "";

/** 세션 토큰 `<id>.<hex 서명>` 검증 — 서명은 상수 시간으로 비교한다 */
export function verifySession(token: string): string | null {
  const [id, sig] = token.split(".");
  if (!id || !sig || !SECRET) return null;
  const want = createHmac("sha256", SECRET).update(id).digest();
  const got = Buffer.from(sig, "hex");
  return got.length === want.length && timingSafeEqual(got, want) ? id : null;
}

/** 사용자 조회 — 값은 파라미터로 바인딩한다 */
export async function loadUser(id: string) {
  return db.query("SELECT id, name FROM users WHERE id = $1", [id]);
}

// L5 재시험 1793085032

// L5 재시험 1793085592

// L5 재시험 1793086055

// L5 재시험 1793086585
