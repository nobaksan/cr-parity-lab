import test from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/slug16b.js";

test("공백은 하이픈으로 바뀐다", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("앞뒤 공백은 지운다", () => {
  assert.equal(slugify("  Post Merge  "), "post-merge");
});
