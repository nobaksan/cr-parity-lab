
import { test } from "node:test";
import assert from "node:assert/strict";
import { BoundedStack } from "../src/stack.js";

test("BoundedStack constructor validates capacity", () => {
  assert.throws(() => new BoundedStack(0), RangeError, "capacity must be a positive integer");
  assert.throws(() => new BoundedStack(-1), RangeError, "capacity must be a positive integer");
  assert.throws(() => new BoundedStack(1.5), RangeError, "capacity must be a positive integer");
  assert.throws(() => new BoundedStack(NaN), RangeError, "capacity must be a positive integer");
  assert.throws(() => new BoundedStack(null), RangeError, "capacity must be a positive integer");
  assert.throws(() => new BoundedStack(undefined), RangeError, "capacity must be a positive integer");
  assert.doesNotThrow(() => new BoundedStack(1));
});

test("BoundedStack push adds elements until capacity is reached", () => {
  const stack = new BoundedStack(2);
  assert.equal(stack.push(1), true);
  assert.equal(stack.size, 1);
  assert.equal(stack.peek(), 1);

  assert.equal(stack.push(2), true);
  assert.equal(stack.size, 2);
  assert.equal(stack.peek(), 2);

  assert.equal(stack.push(3), false);
  assert.equal(stack.size, 2);
  assert.equal(stack.peek(), 2);
});

test("BoundedStack pop removes elements from the top", () => {
  const stack = new BoundedStack(3);
  stack.push(1);
  stack.push(2);
  stack.push(3);

  assert.equal(stack.pop(), 3);
  assert.equal(stack.size, 2);
  assert.equal(stack.peek(), 2);

  assert.equal(stack.pop(), 2);
  assert.equal(stack.size, 1);
  assert.equal(stack.peek(), 1);

  assert.equal(stack.pop(), 1);
  assert.equal(stack.size, 0);
  assert.equal(stack.peek(), undefined);

  assert.equal(stack.pop(), undefined);
  assert.equal(stack.size, 0);
});

test("BoundedStack peek returns the top element without removing it", () => {
  const stack = new BoundedStack(2);
  assert.equal(stack.peek(), undefined);

  stack.push(1);
  assert.equal(stack.peek(), 1);
  stack.push(2);
  assert.equal(stack.peek(), 2);

  stack.pop();
  assert.equal(stack.peek(), 1);

  stack.pop();
  assert.equal(stack.peek(), undefined);
});

test("BoundedStack size returns the number of elements", () => {
  const stack = new BoundedStack(3);
  assert.equal(stack.size, 0);

  stack.push(1);
  assert.equal(stack.size, 1);
  stack.push(2);
  assert.equal(stack.size, 2);

  stack.pop();
  assert.equal(stack.size, 1);
  stack.pop();
  assert.equal(stack.size, 0);
});
