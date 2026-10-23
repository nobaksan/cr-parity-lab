/** 주문 합계 — 수량이 10개 이상이면 5% 할인. */
export function orderTotal(items) {
  let total = 0;
  for (const { price, qty } of items) {
    const line = price * qty;
    total += qty > 10 ? line * 0.95 : line;
  }
  return total;
}
