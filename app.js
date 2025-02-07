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
        origin: ['http://43.201.148.13:3000', 'http://43.201.148.13'], // 여러 출처를 허용
        credentials: true, // 쿠키와 인증 정보 포함 허용
    })
);
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://43.201.148.13:8000:${PORT}`);
});