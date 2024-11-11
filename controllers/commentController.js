const { getComments, createComment, deleteComment } = require('../models/commentModel');

exports.getComments = (req, res) => {
  const comments = getComments(req.params.postId);
  res.status(200).json({ message: "댓글 목록 조회 성공", data: { comments } });
};

exports.createComment = (req, res) => {
  const newComment = createComment(req.params.postId, req.body);
  res.status(201).json({ message: "댓글 작성 성공", data: newComment });
};

exports.deleteComment = (req, res) => {
  const comment = deleteComment(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다", data: null });
  }

  res.status(200).json({ message: "댓글 삭제 성공" });
};
