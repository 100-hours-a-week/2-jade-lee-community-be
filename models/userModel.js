const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users.json');

// 파일에서 사용자 데이터를 읽는 함수
function readUsersFromFile() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('사용자 데이터를 읽는 중 오류 발생:', error);
    return [];
  }
}

function writeUsersToFile(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('사용자 데이터를 저장하는 중 오류 발생:', error);
  }
}

// 이메일 중복 여부 확인
function isEmailTaken(email) {
  const users = readUsersFromFile();
  return users.some(user => user.email === email);
}

// 새 사용자 추가
function addUser(email, password, nickname, profile_image = null) {
  const users = readUsersFromFile();
  const newUser = {
    user_id: users.length > 0 ? users[users.length - 1].user_id + 1 : 1,
    email,
    password,
    nickname,
    profile_image,
  };
  users.push(newUser);
  writeUsersToFile(users);
  return newUser;
}

module.exports = {
  isEmailTaken,
  addUser,
};
