import { test } from "node:test";
import assert from "node:assert/strict";
import { fetch_user, fetch_list } from "../src/api.js";

for (const [id, expected_path] of [
  [42, "/api/users/42"],
  ["alice-123", "/api/users/alice-123"],
  ["alice/bob?role=admin#profile%2F +김", "/api/users/alice%2Fbob%3Frole%3Dadmin%23profile%252F%20%2B%EA%B9%80"],
]) {
  test(`fetch_user preserves the ID ${JSON.stringify(id)} in the request path`, async (t) => {
    const user = { id, name: "Alice" };
    const request = t.mock.method(globalThis, "fetch", async (path) => {
      assert.equal(path, expected_path);
      const url = new URL(path, "https://example.test");
      assert.equal(url.search, "");
      assert.equal(url.hash, "");
      assert.equal(decodeURIComponent(url.pathname.slice("/api/users/".length)), String(id));
      return { json: async () => user };
    });

    assert.equal(await fetch_user(id), user);
    assert.equal(request.mock.callCount(), 1);
  });
}

test("fetch_list returns the JSON from the list endpoint", async (t) => {
  const list = [{ id: 42 }];
  const request = t.mock.method(globalThis, "fetch", async (path) => {
    assert.equal(path, "/api/list");
    return { json: async () => list };
  });

  assert.equal(await fetch_list(), list);
  assert.equal(request.mock.callCount(), 1);
});
