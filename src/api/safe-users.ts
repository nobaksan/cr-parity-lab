import { db } from '../db';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  // 파라미터 바인딩
  const rows = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return Response.json(rows);
}
