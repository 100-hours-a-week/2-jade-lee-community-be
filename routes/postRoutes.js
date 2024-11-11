const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:postId', getPost);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);

module.exports = router;
