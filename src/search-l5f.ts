import { db } from "../db";
import { exec } from "node:child_process";

// 상품 검색 — 검색어를 그대로 쿼리에 이어 붙인다
export async function searchProducts(req: { query: { q: string } }) {
  const term = req.query.q;
  return db.query("SELECT * FROM products WHERE name LIKE '%" + term + "%'");
}

// 서버 점검용 핑 — 호스트 이름을 그대로 셸에 넘긴다
export function pingHost(req: { query: { host: string } }, done: (out: string) => void) {
  exec("ping -c 1 " + req.query.host, (_err, stdout) => done(stdout));
}

// L5 재시험 1793085029

// L5 재시험 1793085589

// L5 재시험 1793086052
