// 배송비 계산 도우미
function calc_shipping(weight, zone, express) {
  let fee = 6000;
  if (zone === "A") {
    fee = 3000;
  } else if (zone === "B") {
    fee = 4000;
  } else if (zone === "C") {
    fee = 5000;
  }
  if (weight > 10) {
    fee += 2000;
  } else if (weight > 5) {
    fee += 1000;
  }
  return express === true ? fee * 2 : fee;
}

function total_with_shipping(items, zone, express) {
  let total = 0;
  let weight = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total += item.price * item.qty;
    weight += item.weight * item.qty;
  }
  return total + calc_shipping(weight, zone, express);
}

module.exports = { calc_shipping, total_with_shipping };
