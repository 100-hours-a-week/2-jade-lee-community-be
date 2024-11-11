const { getPosts, createPost, getPostById, updatePost, deletePost } = require('../models/postModel');

exports.getPosts = (req, res) => {
  const posts = getPosts();
  res.status(200).json({ message: "게시글 목록 조회 성공", data: { posts } });
};

exports.getPost = (req, res) => {
  const post = getPostById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다", data: null });
  }

  res.status(200).json({ message: "게시글 상세조회 성공", data: { post } });
};

exports.createPost = (req, res) => {
  const newPost = createPost(req.body);
  res.status(201).json({ message: "게시글 작성 성공" });
};

exports.updatePost = (req, res) => {
  const post = updatePost(req.params.postId, req.body);

  if (!post) {
    return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다", data: null });
  }

  res.status(200).json({ message: "게시글 수정 성공" });
};

exports.deletePost = (req, res) => {
  const post = deletePost(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다", data: null });
  }

  res.status(200).json({ message: "게시글 삭제 성공" });
};
