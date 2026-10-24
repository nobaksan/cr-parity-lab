import { test } from "node:test";
import assert from "node:assert/strict";
import { parse_age_value } from "../src/probe7c.js";

test("parse_age_value converts complete decimal age strings to integers", () => {
  for (const [text, expected] of [
    ["42", 42],
    ["8", 8],
    ["0", 0],
    ["08", 8],
    [" \t+42\n", 42],
    ["-8", -8],
  ]) {
    assert.equal(parse_age_value(text), expected, JSON.stringify(text));
  }
});

test("parse_age_value returns null for invalid or incomplete age strings", () => {
  for (const text of [
    "not-a-number", "abc", "", " \t\n", "+", "-",
    "12abc", "21 years", "1 2", "4.2", "1e2", "0x10",
    "Infinity", "9".repeat(400),
  ]) {
    assert.equal(parse_age_value(text), null, JSON.stringify(text));
  }
});
