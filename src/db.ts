export interface Row { [k: string]: unknown }

export interface Db {
  query(sql: string, params?: unknown[]): Promise<Row[]>;
}

/** 테스트용 인메모리 DB. */
export function memoryDb(rows: Row[]): Db {
  return {
    async query() {
      return rows;
    },
  };
}
