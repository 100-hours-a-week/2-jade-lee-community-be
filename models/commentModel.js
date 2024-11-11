const fs = require('fs');
const comments = require('../data/comments.json');

exports.getComments = (postId) => comments.filter(comment => comment.postId === postId);

exports.createComment = (postId, comment) => {
  const newComment = { ...comment, postId };
  comments.push(newComment);
  fs.writeFileSync('./data/comments.json', JSON.stringify(comments, null, 2));
  return newComment;
};

exports.deleteComment = (id) => {
  const index = comments.findIndex(comment => comment.id === id);
  if (index !== -1) {
    const deletedComment = comments.splice(index, 1);
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments, null, 2));
    return deletedComment;
  }
};
