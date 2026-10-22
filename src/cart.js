// 장바구니 계산 — 금액은 정수(원) 단위다.

/** 장바구니에 상품을 담는다. 같은 이름이면 수량만 늘린다. */
export function add_item(cart, item) {
  if (!item || typeof item.name !== "string" || item.name === "") throw new TypeError("item.name is required");
  if (!Number.isInteger(item.price) || item.price < 0) throw new RangeError("item.price must be a non-negative integer");
  const qty = item.qty ?? 1;
  if (!Number.isInteger(qty) || qty < 1) throw new RangeError("item.qty must be a positive integer");
  const found = cart.find((x) => x.name === item.name);
  if (found) {
    found.qty += qty;
    return cart;
  }
  cart.push({ name: item.name, price: item.price, qty });
  return cart;
}

export function cart_total(cart) {
  return cart.reduce((sum, x) => sum + x.price * x.qty, 0);
}

export function apply_discount(total, percent) {
  if (!Number.isInteger(total) || total < 0) throw new RangeError("total must be a non-negative integer");
  if (typeof percent !== "number" || percent < 0 || percent > 100) throw new RangeError("percent must be between 0 and 100");
  return Math.round((total * (100 - percent)) / 100);
}
