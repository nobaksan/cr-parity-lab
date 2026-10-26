import { db } from '../db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  // 사용자 입력이 SQL 문자열에 그대로 들어간다
  const rows = await db.query(`SELECT * FROM users WHERE id = '${id}'`);
  return Response.json(rows);
}
