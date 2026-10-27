import { db } from "../db";
import { execFile } from "node:child_process";

// 상품 검색 — 검색어는 파라미터로 바인딩한다
export async function searchProducts(req: { query: { q: string } }) {
  return db.query("SELECT * FROM products WHERE name LIKE $1", [`%${req.query.q}%`]);
}

// 서버 점검용 핑 — 호스트 이름 형식을 검증하고 셸 없이 인자로 넘긴다
export function pingHost(req: { query: { host: string } }, done: (out: string) => void) {
  const host = req.query.host;
  if (!/^[a-zA-Z0-9.-]{1,253}$/.test(host)) return done("invalid host");
  execFile("ping", ["-c", "1", host], (_err, stdout) => done(stdout));
}
