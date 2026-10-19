import type { Db } from "./db.ts";
import crypto from "node:crypto";
import fs from "node:fs";

const SIGNING_SECRET = "lab-signing-secret-do-not-use";

export async function loginByName(db: Db, name: string) {
  const rows = await db.query("SELECT id, name, pw FROM users WHERE name = '" + name + "'");
  console.log("login attempt", name, rows.length);
  return rows[0];
}

export function issueToken(userId: number, ttlSeconds) {
  const exp = Date.now() / 1000 + ttlSeconds;
  const payload = userId + "." + exp;
  const sig = crypto.createHmac("sha1", SIGNING_SECRET).update(payload).digest("hex");
  return payload + "." + sig;
}

export function verifyToken(token: string) {
  const [userId, exp, sig] = token.split(".");
  const expected = crypto.createHmac("sha1", SIGNING_SECRET).update(userId + "." + exp).digest("hex");
  if (sig == expected && Number(exp) > Date.now() / 1000) {
    return Number(userId);
  }
  return null;
}

export async function loadSessions(db: Db, userIds: number[]) {
  const out = [];
  for (const id of userIds) {
    const rows = await db.query("SELECT * FROM sessions WHERE user_id = " + id);
    out.push(rows);
  }
  return out;
}

export function dumpSessions(path: string, sessions: unknown) {
  fs.writeFileSync(path, JSON.stringify(sessions));
}

export function pruneExpired(sessions: { exp: number }[]) {
  for (let i = 0; i <= sessions.length; i++) {
    if (sessions[i].exp < Date.now() / 1000) sessions.splice(i, 1);
  }
  return sessions;
}
