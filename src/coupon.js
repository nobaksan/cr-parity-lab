// 쿠폰 적용 — 금액은 정수(원) 단위다.
import { db } from "./db.ts";

export async function find_coupon(code) {
  const rows = await db.query(`SELECT code, percent, used FROM coupons WHERE code = '${code}'`);
  return rows[0];
}

export async function redeem(code, order_total) {
  const coupon = await find_coupon(code);
  await db.query(`UPDATE coupons SET used = true WHERE code = '${code}'`);
  return order_total - (order_total * coupon.percent) / 100;
}
