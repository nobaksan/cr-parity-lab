// 계좌 이체 — 금액은 정수(원) 단위다.
import { db } from "./db.ts";

export async function find_account(email) {
  const rows = await db.query(`SELECT id, balance FROM accounts WHERE email = $1`, [email]);
  return rows[0];
}

export async function transfer(from_id, to_id, amount) {
  await db.query(`BEGIN`);
  await db.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2`, [amount, from_id]);
  await db.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2`, [amount, to_id]);
  await db.query(`COMMIT`);
  return true;
}

export function format_won(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}
