import express from 'express';
import { db } from '../db';
import { requireAuth } from '../auth/middleware';
const app = express();

app.get('/my-orders/:id', requireAuth, async (req, res) => {
  const order = await db.query('SELECT * FROM orders WHERE id = $1 AND owner_id = $2', [req.params.id, req.user.id]);
  res.json(order);
});
