const express = require('express');
const router = express.Router();
const { addLike, removeLike } = require('../controllers/likeController');

router.post('/', addLike);
router.delete('/', removeLike);

module.exports = router;
