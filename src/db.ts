export interface Row { [k: string]: unknown }

export interface Db {
  query(sql: string, params?: unknown[]): Promise<Row[]>;
}

/** A database that commits successful callbacks and rolls back rejected callbacks. */
export interface TransactionalDb extends Db {
  /** Run on one isolated transaction connection; resolve only after commit. */
  transaction<T>(operation: (db: Db) => Promise<T>): Promise<T>;
}

/** 테스트용 인메모리 DB. */
export function memoryDb(rows: Row[]): Db {
  return {
    async query() {
      return rows;
    },
  };
}
