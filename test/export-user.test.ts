import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { dirname } from "node:path";
import type { Db, Row } from "../src/db.ts";
import { exportUser, parseAge } from "../src/export-user.js";

function trackDirectories(t: TestContext) {
  const directories: string[] = [];
  const mkdtemp = fs.mkdtemp;
  t.mock.method(fs, "mkdtemp", async (prefix: string) => {
    const directory = await mkdtemp(prefix);
    directories.push(directory);
    return directory;
  });
  t.after(async () => {
    await Promise.all(directories.map(directory => fs.rm(directory, { recursive: true, force: true })));
  });
  return directories;
}

test("export binds injection-shaped names and waits for database rows before writing", async t => {
  const directories = trackDirectories(t);
  const name = "O'Brien'; DROP TABLE users; --";
  const rows = [{ id: 1, name }];
  let finish!: (rows: Row[]) => void;
  const db: Db = {
    query(sql, params) {
      assert.equal(sql, "SELECT * FROM users WHERE name = $1");
      assert.deepEqual(params, [name]);
      return new Promise(resolve => { finish = resolve; });
    },
  };
  let settled = false;
  const pending = exportUser(db, name).then(result => {
    settled = true;
    return result;
  });
  await Promise.resolve();
  assert.equal(settled, false);
  assert.deepEqual(directories, []);
  finish(rows);
  const result = await pending;
  assert.equal(result.rows, rows);
  assert.deepEqual(JSON.parse(await fs.readFile(result.path, "utf8")), rows);
  assert.equal(dirname(result.path), directories[0]);
  assert.equal((await fs.stat(result.path)).mode & 0o777, 0o600);
  assert.equal((await fs.stat(dirname(result.path))).mode & 0o777, 0o700);
});

test("concurrent exports have separate private files, including empty results", async t => {
  trackDirectories(t);
  const versions = [[{ id: 1 }], [{ id: 2 }], []];
  const exports = await Promise.all(versions.map(rows => exportUser({ query: async () => rows }, "user")));
  assert.equal(new Set(exports.map(result => dirname(result.path))).size, versions.length);
  for (let i = 0; i < versions.length; i++) {
    assert.deepEqual(JSON.parse(await fs.readFile(exports[i].path, "utf8")), versions[i]);
    assert.equal((await fs.stat(exports[i].path)).mode & 0o777, 0o600);
  }
});

test("export waits until the asynchronous file write finishes", async t => {
  trackDirectories(t);
  const writeFile = fs.writeFile;
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let writing!: () => void;
  const started = new Promise<void>(resolve => { writing = resolve; });
  t.mock.method(fs, "writeFile", async (...args: Parameters<typeof fs.writeFile>) => {
    writing();
    await gate;
    await writeFile(...args);
  });
  let settled = false;
  const pending = exportUser({ query: async () => [] }, "user").then(result => {
    settled = true;
    return result;
  });
  await started;
  assert.equal(settled, false);
  release();
  const result = await pending;
  assert.equal(await fs.readFile(result.path, "utf8"), "[]");
});

test("database and serialization failures create no export directory", async t => {
  const directories = trackDirectories(t);
  const failure = new Error("database lookup failed");
  await assert.rejects(exportUser({ query: async () => { throw failure; } }, "user"), error => error === failure);
  const circular: Row[] = [];
  circular.push({ circular });
  await assert.rejects(exportUser({ query: async () => circular }, "user"), TypeError);
  assert.deepEqual(directories, []);
});

test("a partial write failure propagates and removes the private directory", async t => {
  const directories = trackDirectories(t);
  const writeFile = fs.writeFile;
  const failure = new Error("simulated write failure");
  t.mock.method(fs, "writeFile", async (path: string, _data: string, options: object) => {
    await writeFile(path, "partial", options);
    throw failure;
  });
  await assert.rejects(exportUser({ query: async () => [{ id: 1 }] }, "user"), error => error === failure);
  assert.equal(directories.length, 1);
  await assert.rejects(fs.stat(directories[0]), { code: "ENOENT" });
});

test("ages accept decimal integer strings and reject malformed or unsafe input", () => {
  for (const [input, expected] of [["0", 0], ["08", 8], [" 42 ", 42],
    [String(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER]] as const) {
    assert.equal(parseAge(input), expected);
  }
  for (const input of ["", " ", "12abc", "0x1f", "1e2", "12.5", "-1", "+1", "1\n2",
    "NaN", "Infinity", "9007199254740992", 12, null, undefined, {}, [12]]) {
    assert.throws(() => parseAge(input), TypeError);
  }
});
