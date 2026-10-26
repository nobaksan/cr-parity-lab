import express from 'express';
const app = express();

app.get('/proxy', async (req, res) => {
  // 사용자가 준 URL 로 서버가 그대로 요청한다
  const r = await fetch(String(req.query.url));
  res.send(await r.text());
});
