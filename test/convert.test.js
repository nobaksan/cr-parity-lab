import { test } from "node:test";
import assert from "node:assert/strict";
import { logger, parse_age, to_csv } from "../src/convert.js";

test("age parsing uses decimal integers and logs through logger.info", (t) => {
  const log = t.mock.method(logger, "info", () => {});
  for (const [text, expected] of [
    ["42", 42],
    [" 08", 8],
    ["0x10", 0],
    ["21 years", 21],
    ["invalid", NaN],
  ]) {
    assert.equal(parse_age(text), expected);
    assert.deepEqual(log.mock.calls.at(-1).arguments, ["parsing", text]);
  }
  assert.equal(log.mock.callCount(), 5);
});

test("logger writes the parsing message to stderr", (t) => {
  const write = t.mock.method(process.stderr, "write", () => true);
  assert.equal(parse_age("27"), 27);
  assert.equal(write.mock.callCount(), 1);
  assert.deepEqual(write.mock.calls[0].arguments, ["parsing 27\n"]);
});

test("CSV preserves simple fields, empty values, and row order", () => {
  assert.equal(to_csv([]), "");
  assert.equal(to_csv([
    { name: "Ada", age: 37, active: true },
    { name: "Grace", age: 0, active: false },
  ]), "Ada,37,true\nGrace,0,false");
  assert.equal(to_csv([{ a: "", b: null, c: undefined, d: "last" }]), ",,,last");
});

test("CSV quotes commas, quotes, CR, LF, and combined special characters", () => {
  for (const [value, expected] of [
    ["a,b", '"a,b"'],
    ['a"b', '"a""b"'],
    ["a\rb", '"a\rb"'],
    ["a\nb", '"a\nb"'],
    ["a\r\nb", '"a\r\nb"'],
    ['a,"b"\r\nc', '"a,""b""\r\nc"'],
  ]) {
    assert.equal(to_csv([{ first: value, last: "end" }, { first: "next", last: "row" }]),
      `${expected},end\nnext,row`);
  }
});
