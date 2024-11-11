const fs = require('fs');
const posts = require('../data/posts.json');

exports.getPosts = () => posts;

exports.getPostById = (id) => posts.find(post => post.id === id);

exports.createPost = (post) => {
  posts.push(post);
  fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));
};

exports.updatePost = (id, updatedData) => {
  const post = posts.find(p => p.id === id);
  if (post) {
    Object.assign(post, updatedData);
    fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));
    return post;
  }
};

exports.deletePost = (id) => {
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    const deletedPost = posts.splice(index, 1);
    fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));
    return deletedPost;
  }
};
