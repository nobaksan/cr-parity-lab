import { test } from "node:test";
import assert from "node:assert/strict";
import { logger, parse_age, to_csv } from "../src/convert.js";

test("conversion utilities expose named ES module exports", () => {
  assert.equal(typeof parse_age, "function");
  assert.equal(typeof to_csv, "function");
  assert.equal(typeof logger.info, "function");
});

test("age parsing uses decimal integers and preserves parseInt behavior", () => {
  assert.equal(parse_age("42"), 42);
  assert.equal(parse_age(" 08 "), 8);
  assert.equal(parse_age("0x10"), 0);
  assert.equal(parse_age("12years"), 12);
  assert.equal(parse_age("-3.5"), -3);
  assert.ok(Number.isNaN(parse_age("unknown")));
});

test("age parsing does not log input", (t) => {
  const log = t.mock.method(console, "log", () => {});
  parse_age("42");
  assert.equal(log.mock.callCount(), 0);
});

test("CSV preserves simple values, empty fields, and row ordering", () => {
  assert.equal(to_csv([]), "");
  assert.equal(to_csv([{}]), "");
  assert.equal(to_csv([
    { name: "Ada", age: 42, active: true },
    { name: "김", age: 0, active: false },
  ]), "Ada,42,true\n김,0,false");
  assert.equal(to_csv([{ a: null, b: undefined, c: "", d: "end" }]), ",,,end");
});

test("CSV quotes commas, quotes, and each kind of line break per field", () => {
  assert.equal(to_csv([
    { a: "last, first", b: 'say "hi"', c: "one\ntwo" },
    { a: "one\rtwo", b: "one\r\ntwo", c: 'a,"b"\nc' },
  ]), '"last, first","say ""hi""","one\ntwo"\n"one\rtwo","one\r\ntwo","a,""b""\nc"');
});
