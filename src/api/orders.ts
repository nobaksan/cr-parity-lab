import express from 'express';
import { db } from '../db';
const app = express();

// 로그인한 사용자라면 누구의 주문이든 id 만 알면 읽는다 — 소유자 확인이 없다
app.get('/orders/:id', requireLogin, async (req, res) => {
  const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  res.json(order);
});

function requireLogin(_req: any, _res: any, next: () => void) { next(); }
