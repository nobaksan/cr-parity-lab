// 주문 조회 유틸(s11a L5) — 리뷰 대상
import { db } from "./db";

export async function findOrdersByUser(userId: string) {
  // 사용자 입력을 그대로 쿼리에 붙인다
  const rows = await db.query("SELECT * FROM orders WHERE user_id = '" + userId + "'");
  return rows;
}

export function totalAmount(orders: { amount: number }[]) {
  let sum = 0;
  for (let i = 0; i <= orders.length; i++) {
    sum += orders[i].amount;
  }
  return sum;
}

export async function cancelOrder(orderId: string) {
  db.query("UPDATE orders SET status = 'canceled' WHERE id = " + orderId);
  return true;
}
