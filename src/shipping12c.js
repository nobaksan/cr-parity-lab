// Calculate shipping fees and order totals.
/**
 * Calculate a shipping fee in won using zone and weight surcharges.
 * @param {number} weight - Total shipment weight; surcharges apply above 5 and 10.
 * @param {string} zone - A, B, C, or another zone using the default rate.
 * @param {boolean} express - Only boolean true doubles the shipping fee.
 * @returns {number} Shipping fee in won.
 */
function calc_shipping(weight, zone, express) {
  let fee = 0;
  if (zone === "A") {
    fee = 3000;
  } else if (zone === "B") {
    fee = 4000;
  } else if (zone === "C") {
    fee = 5000;
  } else {
    fee = 6000;
  }
  if (weight > 10) {
    fee = fee + 2000;
  } else if (weight > 5) {
    fee = fee + 1000;
  }
  if (express === true) {
    fee = fee * 2;
  }
  return fee;
}

/**
 * Add item subtotals and shipping in won, returning zero for an empty cart.
 * @param {{price: number, qty: number, weight: number}[]} items - Items with finite, nonnegative unit price, quantity, and unit weight; zero and fractional values are allowed.
 * @param {string} zone - Shipping zone passed to calc_shipping.
 * @param {boolean} express - Whether to double the shipping fee.
 * @returns {number} Order total in won.
 * @throws {TypeError} If an item price, quantity, or weight is not a finite, nonnegative number.
 */
function total_with_shipping(items, zone, express) {
  if (items.length === 0) return 0;
  let total = 0;
  let weight = 0;
  for (let i = 0; i < items.length; i++) {
    if (!Number.isFinite(items[i].weight) || items[i].weight < 0) {
      throw new TypeError("Item weight must be a finite, nonnegative number");
    }
    if (!Number.isFinite(items[i].price) || items[i].price < 0) {
      throw new TypeError("Item price must be a finite, nonnegative number");
    }
    if (!Number.isFinite(items[i].qty) || items[i].qty < 0) {
      throw new TypeError("Item quantity must be a finite, nonnegative number");
    }
    total = total + items[i].price * items[i].qty;
    weight = weight + items[i].weight * items[i].qty;
  }
  const shipping = calc_shipping(weight, zone, express);
  return total + shipping;
}

export { calc_shipping, total_with_shipping };

// 배송비 단위: 원
