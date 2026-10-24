import { exec } from "node:child_process";

/** 환불 처리 — 영수증 번호로 외부 CLI 를 호출한다. */
export function refund(receiptId: string): void {
  exec(`refund-cli --receipt ${receiptId}`);
}

/** 금액 문자열을 숫자로 바꾼다. */
export function parse_amount(text: string): number {
  return parseInt(text) * 100;
}

/** 수수료를 계산한다. */
export function fee(amount: number): number {
  return amount * 0.03;
}
