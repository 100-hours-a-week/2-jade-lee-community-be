import {
    updateProfileModel,
    updatePasswordModel,
    deleteUserModel,} from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getUser = (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(404).json({ message: '사용자가 존재하지 않습니다.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
const logout = (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (error) {
        console.error('로그아웃 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const { user_id } = req.session.user;
        const { nickname, imageFlag } = req.body;

        // imageFlag를 숫자로 변환
        const numericImageFlag = parseInt(imageFlag, 10);

        // 입력 데이터 유효성 검증
        if (!user_id || !nickname || isNaN(numericImageFlag)) {
            return res.status(400).json({ message: '필수 항목이 누락되었거나 잘못된 값입니다.' });
        }

        // 프로필 이미지 처리
        let profileImage = req.file ? `/uploads/profileImages/${req.file.filename}` : null;

        if (numericImageFlag === 1) {
            const previousImagePath = req.session.user.profileImage
                ? path.join(__dirname, '..', req.session.user.profileImage)
                : null;

            if (previousImagePath) {
                fs.unlink(previousImagePath, (err) => {
                    if (err) {
                        console.error('기존 이미지 삭제 오류:', err);
                    } else {
                        console.log('기존 이미지가 삭제되었습니다:', previousImagePath);
                    }
                });
            }

            req.session.user.profileImage = profileImage;
        } else {
            profileImage = req.session.user.profileImage || null;
        }

        // 프로필 업데이트
        await updateProfileModel(user_id, nickname, profileImage, numericImageFlag);

        req.session.user.nickname = nickname;

        res.status(204).json({ message: '프로필이 업데이트되었습니다.' });
    } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

const updateUserPass= async (req, res) => {
    try {
        const { user_id } = req.session.user;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: '필수 항목이 누락되었습니다.'
            });
        }
        await updatePasswordModel(user_id, newPassword);
        res.status(204).json({ message: '비밀번호가 업데이트되었습니다.' });
    } catch (error) {
        console.error('비밀번호 업데이트 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
const deleteUser= async (req, res) => {
    try {
        const { user_id } = req.session.user;
        await deleteUserModel(user_id);
        req.session.destroy(); // 세션 삭제
        res.status(200).json({ message: '사용자 계정이 삭제되었습니다.' });
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
export { getUser, updateUserProfile, updateUserPass, deleteUser, logout };