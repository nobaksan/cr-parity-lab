// This file contains shipping calculation logic.
// 배송비 계산 도우미
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
  if (express) {
    fee = fee * 2;
  }
  return fee;
}

function total_with_shipping(items, zone, express) {
  let total = 0;
  let weight = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].qty;
    weight += items[i].weight * items[i].qty;
  }
  const shipping = calc_shipping(weight, zone, express);
  const result = total + shipping;
  return result;
}

module.exports = { calc_shipping, total_with_shipping };

// 단위: 원
