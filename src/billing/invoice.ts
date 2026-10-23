import { taxFor } from "./tax.ts";

export interface LineItem { name: string; unitPrice: number; qty: number }
export interface Invoice { subtotal: number; tax: number; total: number }

/** 항목 합계와 세금을 계산한다. 수량·단가가 음수면 오류. */
export function buildInvoice(region: string, items: LineItem[]): Invoice {
  let subtotal = 0;
  for (const it of items) {
    if (it.qty < 0 || it.unitPrice < 0) throw new Error(`invalid line: ${it.name}`);
    subtotal += it.unitPrice * it.qty;
  }
  const tax = taxFor(region, subtotal);
  return { subtotal, tax, total: subtotal + tax };
}

/** 청구서를 한 줄 문자열로 만든다. */
export function formatInvoice(inv: Invoice): string {
  return `소계 ${inv.subtotal} + 세금 ${inv.tax} = ${inv.total}`;
}
