const { addUser, isEmailTaken } = require('../models/userModel');

// 회원가입 컨트롤러
const signup = (req, res) => {
  try {
    const { email, password, nickname, profile_image } = req.body;

    // 필수 데이터 검증
    if (!email || !password || !nickname) {
      return res.status(400).json({
        message: 'invalid_request',
        data: null,
      });
    }

    // 중복된 이메일 검사
    if (isEmailTaken(email)) {
      return res.status(400).json({
        message: 'invalid_request',
        data: null,
      });
    }

    // 사용자 추가
    const newUser = addUser(email, password, nickname, profile_image);

    // 성공 응답
    return res.status(201).json({
      message: 'register_success',
      data: {
        user_id: newUser.user_id,
      },
    });
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error);

    // 서버 오류 응답
    return res.status(500).json({
      message: 'internal_server_error',
      data: null,
    });
  }
};

module.exports = {
  signup,
};
