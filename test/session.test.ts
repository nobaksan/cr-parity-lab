import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { Db } from "../src/db.ts";
import {
  dumpSessions, issueToken, loadSessions, loginByName, pruneExpired, verifyToken,
} from "../src/session.ts";

function configureKey(t: TestContext) {
  const previous = process.env.SESSION_SIGNING_SECRET;
  process.env.SESSION_SIGNING_SECRET = crypto.randomBytes(32).toString("hex");
  t.after(() => {
    if (previous === undefined) delete process.env.SESSION_SIGNING_SECRET;
    else process.env.SESSION_SIGNING_SECRET = previous;
  });
}

async function temporaryDirectory(t: TestContext) {
  const directory = await fs.mkdtemp(join(tmpdir(), "session-test-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}

test("login binds an injection-shaped name and returns the first row", async () => {
  const name = "' OR 1=1 --";
  const user = { id: 1, name };
  const db: Db = {
    async query(sql, params) {
      assert.equal(sql, "SELECT id, name, pw FROM users WHERE name = $1");
      assert.deepEqual(params, [name]);
      return [user, { id: 2 }];
    },
  };
  assert.equal(await loginByName(db, name), user);
  assert.equal(await loginByName({ query: async () => [] }, "missing"), undefined);
});

test("session queries bind every ID and preserve result order", async () => {
  const ids = [2, "1 OR 1=1" as unknown as number];
  let calls = 0;
  const db: Db = {
    async query(sql, params) {
      assert.equal(sql, "SELECT * FROM sessions WHERE user_id = $1");
      assert.deepEqual(params, [ids[calls++]]);
      return [{ user_id: params![0] }];
    },
  };
  assert.deepEqual(await loadSessions(db, ids), ids.map(id => [{ user_id: id }]));
  assert.equal(calls, 2);
  assert.deepEqual(await loadSessions(db, []), []);
  assert.equal(calls, 2);
});

test("issued tokens round-trip even when the clock has fractional seconds", t => {
  configureKey(t);
  t.mock.timers.enable({ apis: ["Date"], now: 1_700_000_000_123 });
  const token = issueToken(42, 60);
  assert.match(token, /^42\.1700000060\.[a-f0-9]{64}$/);
  assert.equal(verifyToken(token), 42);
  assert.equal(verifyToken(issueToken(0, 60)), 0);
  assert.equal(verifyToken(token.replace(/^42/, "43")), null);
  assert.equal(verifyToken(token.replace("1700000060", "1700000120")), null);
  assert.equal(verifyToken(token + ".extra"), null);
  assert.equal(verifyToken(token + "\n"), null);
  assert.equal(verifyToken(token.slice(0, -1)), null);
  t.mock.timers.tick(59_877);
  assert.equal(verifyToken(token), null);
});

test("tokens require a configured key and stop working after rotation", t => {
  configureKey(t);
  const token = issueToken(42, 60);
  for (const invalid of [undefined, "short"]) {
    if (invalid === undefined) delete process.env.SESSION_SIGNING_SECRET;
    else process.env.SESSION_SIGNING_SECRET = invalid;
    assert.throws(() => issueToken(42, 60), /SESSION_SIGNING_SECRET/);
    assert.throws(() => verifyToken(token), /SESSION_SIGNING_SECRET/);
  }
  process.env.SESSION_SIGNING_SECRET = crypto.randomBytes(32).toString("hex");
  assert.equal(verifyToken(token), null);
});

test("legacy tokens and forgeries using the exposed key are rejected", t => {
  configureKey(t);
  const payload = "42." + (Math.floor(Date.now() / 1000) + 3600);
  for (const algorithm of ["sha1", "sha256"]) {
    const signature = crypto.createHmac(algorithm, "lab-signing-secret-do-not-use")
      .update(payload).digest("hex");
    assert.equal(verifyToken(payload + "." + signature), null);
  }
});

test("token validation rejects invalid IDs, TTLs, and malformed fields", t => {
  configureKey(t);
  for (const id of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => issueToken(id, 60), RangeError);
  }
  for (const ttl of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
    assert.throws(() => issueToken(42, ttl), RangeError);
  }
  for (const token of ["", ".", "42.NaN." + "a".repeat(64),
    "01.9999999999." + "a".repeat(64), "9007199254740992.9999999999." + "a".repeat(64)]) {
    assert.equal(verifyToken(token), null);
  }
});

test("dump replaces a complete file using a private same-directory temporary file", async t => {
  const directory = await temporaryDirectory(t);
  const path = join(directory, "sessions.json");
  const original = "[{\"old\":true}]";
  const sessions = [{ userId: 42 }];
  await fs.writeFile(path, original);
  const rename = fs.rename;
  const renameMock = t.mock.method(fs, "rename", async (source: string, destination: string) => {
    assert.equal(dirname(source), directory);
    assert.equal(destination, path);
    assert.notEqual(source, destination);
    assert.equal(await fs.readFile(path, "utf8"), original);
    assert.deepEqual(JSON.parse(await fs.readFile(source, "utf8")), sessions);
    if (process.platform !== "win32") {
      assert.equal((await fs.stat(source)).mode & 0o777, 0o600);
    }
    await rename(source, destination);
  });
  await dumpSessions(path, sessions);
  assert.equal(renameMock.mock.callCount(), 1);
  assert.deepEqual(JSON.parse(await fs.readFile(path, "utf8")), sessions);
  assert.deepEqual(await fs.readdir(directory), ["sessions.json"]);
});

test("a partial temporary write failure preserves the destination and cleans up", async t => {
  const directory = await temporaryDirectory(t);
  const path = join(directory, "sessions.json");
  await fs.writeFile(path, "original");
  const failure = new Error("simulated write failure");
  const open = fs.open;
  t.mock.method(fs, "open", async (...args: Parameters<typeof fs.open>) => {
    const file = await open(...args);
    t.mock.method(file, "writeFile", async () => {
      await file.write("partial");
      throw failure;
    });
    return file;
  });
  await assert.rejects(dumpSessions(path, []), error => error === failure);
  assert.equal(await fs.readFile(path, "utf8"), "original");
  assert.deepEqual(await fs.readdir(directory), ["sessions.json"]);
});

test("a failed replacement preserves the destination and removes the temporary file", async t => {
  const directory = await temporaryDirectory(t);
  const path = join(directory, "sessions.json");
  await fs.writeFile(path, "original");
  const failure = new Error("simulated rename failure");
  t.mock.method(fs, "rename", async () => { throw failure; });
  await assert.rejects(dumpSessions(path, []), error => error === failure);
  assert.equal(await fs.readFile(path, "utf8"), "original");
  assert.deepEqual(await fs.readdir(directory), ["sessions.json"]);
});

test("concurrent dumps produce one complete document and leave no temporary files", async t => {
  const directory = await temporaryDirectory(t);
  const path = join(directory, "sessions.json");
  const versions = [[{ id: 1 }], [{ id: 2 }], [{ id: 3 }]];
  await Promise.all(versions.map(sessions => dumpSessions(path, sessions)));
  const result = await fs.readFile(path, "utf8");
  assert.ok(versions.some(sessions => JSON.stringify(sessions) === result));
  assert.deepEqual(await fs.readdir(directory), ["sessions.json"]);
});

test("unserializable sessions leave the destination untouched", async t => {
  const directory = await temporaryDirectory(t);
  const path = join(directory, "sessions.json");
  await fs.writeFile(path, "original");
  const circular: unknown[] = [];
  circular.push(circular);
  for (const sessions of [undefined, circular]) {
    await assert.rejects(dumpSessions(path, sessions), TypeError);
    assert.equal(await fs.readFile(path, "utf8"), "original");
    assert.deepEqual(await fs.readdir(directory), ["sessions.json"]);
  }
});

test("pruning handles empty, adjacent, all-expired, and boundary entries in place", t => {
  t.mock.timers.enable({ apis: ["Date"], now: 1_700_000_000_000 });
  const now = Date.now() / 1000;
  const future = { exp: now + 60 };
  const sessions = [{ exp: now - 2 }, { exp: now - 1 }, future, { exp: now }];
  assert.equal(pruneExpired(sessions), sessions);
  assert.deepEqual(sessions, [future]);
  assert.deepEqual(pruneExpired([]), []);
  assert.deepEqual(pruneExpired([{ exp: now - 2 }, { exp: now - 1 }]), []);
  assert.deepEqual(pruneExpired([future, future]), [future, future]);
});
