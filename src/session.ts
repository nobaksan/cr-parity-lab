import type { Db } from "./db.ts";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { basename, dirname, join } from "node:path";

/** Read the deployment-managed signing key, failing closed on missing configuration. */
function signingSecret(): string {
  const secret = process.env.SESSION_SIGNING_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("SESSION_SIGNING_SECRET must contain at least 32 bytes");
  }
  return secret;
}

/** Look up the first user with the given name, or return undefined. */
export async function loginByName(db: Db, name: string) {
  const rows = await db.query("SELECT id, name, pw FROM users WHERE name = $1", [name]);
  return rows[0];
}

/** Issue a SHA-256 token using the configured key and a positive whole-second TTL. */
export function issueToken(userId: number, ttlSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  if (!Number.isSafeInteger(userId) || userId < 0 ||
      !Number.isSafeInteger(ttlSeconds) || ttlSeconds <= 0 || !Number.isSafeInteger(exp)) {
    throw new RangeError("userId and TTL must be valid nonnegative/positive safe integers");
  }
  const payload = userId + "." + exp;
  const sig = crypto.createHmac("sha256", signingSecret()).update(payload).digest("hex");
  return payload + "." + sig;
}

/** Return the user ID for a valid unexpired token; reject malformed and legacy tokens. */
export function verifyToken(token: string) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.([a-f0-9]{64})$/.exec(token);
  if (!match || match[0] !== token) return null;
  const [, userId, exp, sig] = match;
  if (!Number.isSafeInteger(Number(userId)) || !Number.isSafeInteger(Number(exp))) return null;
  const expected = crypto.createHmac("sha256", signingSecret()).update(userId + "." + exp).digest();
  if (crypto.timingSafeEqual(Buffer.from(sig, "hex"), expected) && Number(exp) > Date.now() / 1000) {
    return Number(userId);
  }
  return null;
}

/** Load one session result set per user ID, preserving the input order. */
export async function loadSessions(db: Db, userIds: number[]) {
  const out = [];
  for (const id of userIds) {
    const rows = await db.query("SELECT * FROM sessions WHERE user_id = $1", [id]);
    out.push(rows);
  }
  return out;
}

/** Atomically replace a caller-selected session file; callers must await completion. */
export async function dumpSessions(path: string, sessions: unknown) {
  const data = JSON.stringify(sessions);
  if (data === undefined) throw new TypeError("sessions must be JSON serializable");
  const temporaryPath = join(dirname(path), `.${basename(path)}.${crypto.randomUUID()}.tmp`);
  const file = await fs.open(temporaryPath, "wx", 0o600);
  try {
    try {
      await file.writeFile(data, "utf8");
    } finally {
      await file.close();
    }
    await fs.rename(temporaryPath, path);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
}

/** Remove expired entries in place and return the same array. */
export function pruneExpired(sessions: { exp: number }[]) {
  const now = Date.now() / 1000;
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].exp <= now) sessions.splice(i, 1);
  }
  return sessions;
}
