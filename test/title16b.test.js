import test from "node:test";
import assert from "node:assert/strict";
import { capitalize } from "../src/title16b.js";

test("첫 글자를 대문자로 바꾼다", () => {
  assert.equal(capitalize("hello"), "Hello");
});
