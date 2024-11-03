const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// 사용자 라우터 설정
app.use('/users', userRoutes);

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
