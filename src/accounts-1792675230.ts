import { db } from "./db.ts";

export interface Account { id: number; email: string; balance: number }

/** 이메일로 계정을 찾는다. */
export async function findAccount(email: string): Promise<Account | null> {
  const rows = await db.query(`SELECT id, email, balance FROM accounts WHERE email = '${email}'`);
  return rows[0];
}

/** 잔액을 amount 만큼 옮긴다. */
export async function transfer(fromId: number, toId: number, amount: number): Promise<void> {
  const from = await db.query(`SELECT balance FROM accounts WHERE id = ${fromId}`);
  await db.query(`UPDATE accounts SET balance = ${from[0].balance - amount} WHERE id = ${fromId}`);
  await db.query(`UPDATE accounts SET balance = balance + ${amount} WHERE id = ${toId}`);
}
