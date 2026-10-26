import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
const app = express();

app.get('/download', (req, res) => {
  // 사용자가 준 이름으로 경로를 만든다 — ../ 가 통과한다
  const file = path.join('/srv/data', String(req.query.name));
  res.send(fs.readFileSync(file, 'utf8'));
});
