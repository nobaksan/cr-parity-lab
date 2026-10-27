import assert from "node:assert/strict";
import test from "node:test";
import { convert, convert_all } from "../src/convert-23i.ts";

test("convert uppercases the first character of each word", () => {
  assert.equal(convert("a b"), "A B");
});

test("convert handles empty and whitespace-only input", () => {
  assert.equal(convert(""), "");
  assert.equal(convert(" \t\n "), "");
});

test("convert trims and normalizes whitespace without changing word tails", () => {
  assert.equal(convert(" \theLLo\n\tworld  "), "HeLLo World");
});

test("convert uppercases complete Unicode code points and preserves the rest", () => {
  assert.equal(convert("\u{10428}bc \u{10428}de"), "\u{10400}bc \u{10400}de");
  assert.equal(convert("\u{1F600}\u{10428}bc"), "\u{1F600}\u{10428}bc");
  assert.equal(convert("ßeta"), "SSeta");
});

test("convert_all maps strings in order without changing the input array", () => {
  const inputs = ["a b", "", " \u{10428}bc "];
  assert.deepEqual(convert_all(inputs), ["A B", "", "\u{10400}bc"]);
  assert.deepEqual(inputs, ["a b", "", " \u{10428}bc "]);
  assert.deepEqual(convert_all([]), []);
});
