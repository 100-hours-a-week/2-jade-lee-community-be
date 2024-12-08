import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import fs from 'fs';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir1 = path.join(__dirname, 'uploads/profileImages');
const uploadDir2 = path.join(__dirname, 'uploads/postImages');
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, 
            httpOnly: true, 
            maxAge: 60 * 60 * 1000,
        },
    })
);
app.use(
    cors({
        origin: 'http://3.34.40.191:3000',
        credentials: true, 
    })
);
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://3.34.40.191:8000:${PORT}`);
});