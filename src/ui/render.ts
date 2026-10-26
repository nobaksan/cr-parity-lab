import express from 'express';
const app = express();

app.get('/greet', (req, res) => {
  // 요청 값을 이스케이프 없이 HTML 로 돌려준다
  res.send(`<h1>안녕하세요, ${req.query.name}</h1>`);
});
