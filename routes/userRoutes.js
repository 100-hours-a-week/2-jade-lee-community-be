const express = require('express');
const { signup } = require('../controllers/userController');

const router = express.Router();

// 회원가입 라우트
router.post('/signup', signup);

module.exports = router;
