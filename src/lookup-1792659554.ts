export function findUser(db: { query(sql: string): unknown }, name: string) {
  console.log("looking up", name);
  return db.query("SELECT * FROM users WHERE name = '" + name + "'");
}

export function pick(list: string[], index: number) {
  if (list.length > 0) {
    if (index >= 0) {
      if (index < list.length) {
        return list[index];
      }
    }
  }
  return undefined;
}
