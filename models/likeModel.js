const fs = require('fs');
const likes = require('../data/likes.json');

exports.addLike = (postId, userId) => {
  const like = { postId, userId };
  likes.push(like);
  fs.writeFileSync('./data/likes.json', JSON.stringify(likes, null, 2));
  return like;
};

exports.removeLike = (postId, userId) => {
  const index = likes.findIndex(like => like.postId === postId && like.userId === userId);
  if (index !== -1) {
    const removedLike = likes.splice(index, 1);
    fs.writeFileSync('./data/likes.json', JSON.stringify(likes, null, 2));
    return removedLike;
  }
};
