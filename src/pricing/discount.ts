// 장바구니 할인 계산
export function applyDiscount(price: number, rate: number): number {
  // 금액을 부동소수점으로 곱해 반올림 오차가 생긴다
  return Math.round(price * (1 - rate) * 100) / 100;
}

export function bulkDiscount(prices: number[], rate: number): number[] {
  const out: number[] = [];
  for (let i = 0; i <= prices.length; i++) {
    out.push(applyDiscount(prices[i], rate));
  }
  return out;
}

export function formatKrw(value: number): string {
  return value.toFixed(0) + "원";
}
