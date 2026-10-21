import test from "node:test";
import assert from "node:assert/strict";
import { buildInvoice, formatInvoice } from "../src/billing/invoice.ts";

test("한국 세율 10%", () => {
  const inv = buildInvoice("KR", [{ name: "a", unitPrice: 1000, qty: 3 }]);
  assert.deepEqual(inv, { subtotal: 3000, tax: 300, total: 3300 });
  assert.equal(formatInvoice(inv), "소계 3000 + 세금 300 = 3300");
});

test("음수 수량은 거부", () => {
  assert.throws(() => buildInvoice("KR", [{ name: "x", unitPrice: 1, qty: -1 }]), /invalid line/);
});
