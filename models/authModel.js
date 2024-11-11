const fs = require('fs');
const users = require('../data/users.json');

exports.findUserByEmail = (email) => users.find(user => user.email === email);

exports.createUser = (user) => {
  users.push(user);
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
};
