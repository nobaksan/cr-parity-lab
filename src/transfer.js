// 계좌 이체 — 금액은 정수(원) 단위다.
import { db } from "./db.ts";

export async function find_account(email) {
  const rows = await db.query(`SELECT id, balance FROM accounts WHERE email = $1`, [email]);
  return rows[0];
}

export async function transfer(from_id, to_id, amount) {
  const from = await db.query(`SELECT balance FROM accounts WHERE id = ${from_id}`);
  await db.query(`UPDATE accounts SET balance = ${from[0].balance - amount} WHERE id = ${from_id}`);
  await db.query(`UPDATE accounts SET balance = balance + ${amount} WHERE id = ${to_id}`);
  return true;
}

export function format_won(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}
