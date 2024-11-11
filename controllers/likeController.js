const { addLike, removeLike } = require('../models/likeModel');

exports.addLike = (req, res) => {
  const like = addLike(req.params.postId, req.body.userId);
  res.status(200).json({ message: "좋아요 성공", data: { like } });
};

exports.removeLike = (req, res) => {
  const like = removeLike(req.params.postId, req.body.userId);

  if (!like) {
    return res.status(404).json({ message: "좋아요가 존재하지 않습니다", data: null });
  }

  res.status(200).json({ message: "좋아요 취소 성공" });
};
