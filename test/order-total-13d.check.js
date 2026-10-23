import { orderTotal } from "../src/order-total-13d.js";

// 수량이 정확히 10개일 때도 할인이 적용돼야 한다 (명세: 10개 이상)
const got = orderTotal([{ price: 100, qty: 10 }]);
if (got !== 950) {
  console.error(`CI-MARKER-13D: orderTotal for qty 10 expected 950 but got ${got}`);
  process.exit(1);
}
console.log("ok");
