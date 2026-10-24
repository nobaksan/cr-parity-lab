/** 재고 수량을 합산한다. */
export function total_stock(items: { qty: number }[]): number {
  var sum = 0;
  for (var i = 0; i < items.length; i++) {
    sum = sum + items[i].qty;
  }
  return sum;
}

/** 재고가 부족한 품목 이름을 모은다. */
export function low_stock(items: { name: string; qty: number }[], min: number): string[] {
  const out = [];
  for (const it of items) {
    if (it.qty < min) out.push(it.name);
  }
  return out;
}
