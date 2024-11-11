const express = require('express');
const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/posts/:postId/comments', commentRoutes);
app.use('/api/v1/posts/:postId/like', likeRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
