import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { Db, TransactionalDb } from "../src/db.ts";
import { findAccount, find_account, transfer } from "../src/accounts-1792675230.ts";

/** Real SQL fixture: serialize transactions on a single SQLite connection. */
function create_database(t: TestContext) {
  const connection = new DatabaseSync(":memory:");
  t.after(() => connection.close());
  connection.exec(`
    CREATE TABLE accounts (id INTEGER PRIMARY KEY, email TEXT UNIQUE, balance REAL NOT NULL CHECK (balance >= 0));
    INSERT INTO accounts VALUES (1, 'source@example.com', 100), (2, 'target@example.com', 20), (3, 'other@example.com', 0);
  `);
  const queries: Db = {
    async query(sql, params = []) {
      const bindings: Record<string, SQLInputValue> = {};
      for (const [index, value] of params.entries()) bindings[`$${index + 1}`] = value as SQLInputValue;
      return connection.prepare(sql).all(bindings).map(row => ({ ...row }));
    },
  };
  let tail: Promise<void> = Promise.resolve();
  const db: TransactionalDb = {
    query: queries.query,
    transaction<T>(operation: (db: Db) => Promise<T>): Promise<T> {
      const result = tail.then(async () => {
        connection.exec("BEGIN");
        try {
          const value = await operation(queries);
          connection.exec("COMMIT");
          return value;
        } catch (error) {
          connection.exec("ROLLBACK");
          throw error;
        }
      });
      tail = result.then(() => {}, () => {});
      return result;
    },
  };
  return { db, connection };
}

/** Read all balances to detect unintended changes and lost money. */
async function read_balances(db: Db) {
  return (await db.query("SELECT balance FROM accounts ORDER BY id")).map(row => row.balance);
}

test("lookup binds emails, preserves the first row, and returns null for no match", async () => {
  assert.equal(findAccount, find_account);
  for (const email of ["source@example.com", "O'Brien@example.com", "' OR 1=1 --", ""]) {
    const account = { id: 1, email, balance: 100 };
    const db: Db = {
      async query(sql, params) {
        assert.equal(sql, "SELECT id, email, balance FROM accounts WHERE email = $1");
        assert.deepEqual(params, [email]);
        return [account, { id: 2 }];
      },
    };
    assert.equal(await findAccount(db, email), account);
  }
  assert.equal(await findAccount({ query: async () => [] }, "missing@example.com"), null);
  const failure = new Error("lookup failed");
  await assert.rejects(findAccount({ query: async () => { throw failure; } }, "email"), error => error === failure);
});

test("real SQL lookup treats injection-shaped emails as data", async t => {
  const { db } = create_database(t);
  assert.deepEqual(await findAccount(db, "source@example.com"), { id: 1, email: "source@example.com", balance: 100 });
  assert.equal(await findAccount(db, "' OR 1=1 --"), null);
});

test("invalid amounts reject before any database access", async () => {
  const db: TransactionalDb = {
    async query() { assert.fail("unexpected query"); },
    async transaction() { assert.fail("unexpected transaction"); },
  };
  for (const amount of [0, -0, -1, NaN, Infinity, -Infinity, "5" as unknown as number]) {
    await assert.rejects(transfer(db, 1, 2, amount), RangeError);
  }
});

test("both updates bind amounts and IDs on the transaction connection", async () => {
  const from_id = "1 OR 1=1" as unknown as number;
  const to_id = "2; DROP TABLE accounts; --" as unknown as number;
  const calls: [string, unknown[] | undefined][] = [];
  const db: TransactionalDb = {
    async query() { assert.fail("updates must use the transaction connection"); },
    async transaction(operation) {
      return operation({
        async query(sql, params) {
          calls.push([sql, params]);
          return [{ id: calls.length }];
        },
      });
    },
  };
  await transfer(db, from_id, to_id, 12.5);
  assert.deepEqual(calls, [
    ["UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1 RETURNING id", [12.5, from_id]],
    ["UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING id", [12.5, to_id]],
  ]);
});

test("transfers update both accounts, including fractional amounts and self transfers", async t => {
  const { db } = create_database(t);
  await transfer(db, 1, 2, 12.5);
  assert.deepEqual(await read_balances(db), [87.5, 32.5, 0]);
  await transfer(db, 1, 1, 10);
  assert.deepEqual(await read_balances(db), [87.5, 32.5, 0]);
});

test("missing accounts, insufficient funds and injection-shaped IDs leave balances intact", async t => {
  const { db } = create_database(t);
  for (const [from_id, to_id, amount] of [
    [99, 2, 10], [1, 99, 10], [1, 2, 101],
    ["1 OR 1=1" as unknown as number, 2, 10],
    [1, "2 OR 1=1" as unknown as number, 10],
  ]) {
    await assert.rejects(transfer(db, from_id, to_id, amount));
    assert.deepEqual(await read_balances(db), [100, 20, 0]);
  }
});

test("an SQL failure during credit rolls back the debit", async t => {
  const { db, connection } = create_database(t);
  connection.exec(`CREATE TRIGGER reject_credit BEFORE UPDATE ON accounts
    WHEN NEW.id = 2 BEGIN SELECT RAISE(ABORT, 'credit unavailable'); END`);
  await assert.rejects(transfer(db, 1, 2, 10), /credit unavailable/);
  assert.deepEqual(await read_balances(db), [100, 20, 0]);
});

test("each update must return exactly one row or all writes roll back", async t => {
  const { db } = create_database(t);
  for (const failed_update of [1, 2]) {
    for (const result of [[], [{ id: 1 }, { id: 2 }]]) {
      const adapter: TransactionalDb = {
        query: db.query,
        transaction(operation) {
          return db.transaction(async transaction_db => {
            let calls = 0;
            return operation({
              async query(sql, params) {
                const rows = await transaction_db.query(sql, params);
                return ++calls === failed_update ? result : rows;
              },
            });
          });
        },
      };
      await assert.rejects(transfer(adapter, 1, 2, 10));
      assert.deepEqual(await read_balances(db), [100, 20, 0]);
    }
  }
});

test("concurrent transfers preserve both debits and total funds", async t => {
  const { db } = create_database(t);
  await Promise.all([transfer(db, 1, 2, 30), transfer(db, 1, 3, 40)]);
  assert.deepEqual(await read_balances(db), [30, 50, 40]);
});

test("concurrent transfers cannot overdraw the source", async t => {
  const { db } = create_database(t);
  const results = await Promise.allSettled([transfer(db, 1, 2, 80), transfer(db, 1, 3, 80)]);
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(results.filter(result => result.status === "rejected").length, 1);
  assert.deepEqual(await read_balances(db), [20, 100, 0]);
});

test("transfer waits for transaction settlement and propagates commit failures", async () => {
  let finish!: () => void;
  let callback_finished!: () => void;
  const callback_done = new Promise<void>(resolve => { callback_finished = resolve; });
  const commit = new Promise<void>(resolve => { finish = resolve; });
  let settled = false;
  const failure = new Error("commit failed");
  const db: TransactionalDb = {
    async query() { assert.fail("unexpected root query"); },
    async transaction(operation) {
      await operation({ query: async () => [{ id: 1 }] });
      callback_finished();
      await commit;
      throw failure;
    },
  };
  const pending = transfer(db, 1, 2, 1).finally(() => { settled = true; });
  await callback_done;
  assert.equal(settled, false);
  finish();
  await assert.rejects(pending, error => error === failure);
});
