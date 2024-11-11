const { createUser, findUserByEmail } = require('../models/authModel');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
  const { email, password, nickname, profile_image } = req.body;
  const user = findUserByEmail(email);

  if (user) {
    return res.status(409).json({ message: "email 중복", data: null });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { email, password: hashedPassword, nickname, profile_image };
  createUser(newUser);

  res.status(201).json({ message: "회원가입 성공" });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "인증 실패", data: null });
  }

  res.status(200).json({ message: "로그인 성공", data: { user_id: user.id } });
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "로그아웃 성공", data: null });
};
