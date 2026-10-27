import { db } from '../db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  // 사용자 입력이 SQL 문자열에 그대로 들어간다
  const rows = await db.query(`SELECT * FROM users WHERE id = '${id}'`);
  return Response.json(rows);
}
// S23d L5 drift 시험: 주석 한 줄 추가 (동작 변경 없음)
// S23d L5 drift 2차(최종 코드): 주석 한 줄 추가 (동작 변경 없음)
