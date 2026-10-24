import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Export matching rows to a unique private JSON file and return { rows, path }.
 * Callers must await completion and remove the file and its directory when done.
 * If write and cleanup both fail, reject with an AggregateError exposing path.
 * @param {import("./db.ts").Db} db
 * @param {string} name
 * @returns {Promise<{ rows: import("./db.ts").Row[], path: string }>}
 */
export async function exportUser(db, name) {
  const rows = await db.query("SELECT * FROM users WHERE name = $1", [name]);
  const data = JSON.stringify(rows);
  if (data === undefined) throw new TypeError("Rows must be JSON serializable");
  const directory = await fs.mkdtemp(join(tmpdir(), "user-export-"));
  const path = join(directory, "export.json");
  try {
    await fs.writeFile(path, data, { mode: 0o600, flag: "wx" });
  } catch (error) {
    try {
      await fs.rm(directory, { recursive: true, force: true });
    } catch (cleanupError) {
      throw Object.assign(new AggregateError([error, cleanupError],
        "Export write and temporary directory cleanup failed", { cause: error }), { path });
    }
    throw error;
  }
  return { rows, path };
}

/** Parse a trimmed decimal age string as a nonnegative safe integer; throw on invalid input. */
export function parseAge(s) {
  if (typeof s !== "string" || !/^\d+$/.test(s.trim())) {
    throw new TypeError("Age must be a nonnegative decimal integer string");
  }
  const age = Number(s.trim());
  if (!Number.isSafeInteger(age)) {
    throw new TypeError("Age must be a safe integer");
  }
  return age;
}

/** Encode row values as CSV, quoting commas, quotes and line breaks; nullish values are empty. */
export function toCsv(rows) {
  return rows.map((r) => Object.values(r).map((value) => {
    const field = value == null ? "" : String(value);
    return /[",\r\n]/.test(field) ? '"' + field.replaceAll('"', '""') + '"' : field;
  }).join(",")).join("\n");
}

/** Return whether the input loosely equals the string "true". */
export function parseBool(v) {
  return v == "true";
}
