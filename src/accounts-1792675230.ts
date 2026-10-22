import type { Db, Row, TransactionalDb } from "./db.ts";

export interface Account extends Row { id: number; email: string; balance: number }

/** 이메일로 계정을 찾는다. */
export async function find_account(db: Db, email: string): Promise<Account | null> {
  const rows = await db.query("SELECT id, email, balance FROM accounts WHERE email = $1", [email]);
  return (rows[0] as Account | undefined) ?? null;
}


/** 잔액을 amount 만큼 옮긴다. */
export async function transfer(db: TransactionalDb, fromId: number, toId: number, amount: number): Promise<void> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError("Transfer amount must be a finite positive number");
  }

  await db.transaction(async transaction_db => {
    const debit = await transaction_db.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1 RETURNING id",
      [amount, fromId],
    );
    if (debit.length !== 1) {
      throw new Error("Source account missing or insufficient balance");
    }

    const credit = await transaction_db.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING id",
      [amount, toId],
    );
    if (credit.length !== 1) {
      throw new Error("Destination account must be updated exactly once");
    }
  });
}
