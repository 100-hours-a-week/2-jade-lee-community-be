import {
    loadUsersModel,
    findUserByEmailModel,
    addUserModel,
} from '../models/userModel.js';

const signUp = async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        // 입력값 검증
        if (!email || !password || !nickname) {
            return res.status(400).json({
                success: false,
                message: '필수 항목이 누락되었습니다.',
            });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 이메일 형식입니다.',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 최소 8자 이상이어야 합니다.',
            });
        }

        const profileImage = req.file ? `/uploads/profileImages/${req.file.filename}` : null;

        // 이메일 중복 체크
        const emailExists = await findUserByEmailModel(email);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 이메일입니다.',
            });
        }

        const newUser = {
            email,
            password,
            nickname,
            profileImage,
        };

        await addUserModel(newUser);

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                email,
                nickname,
                profileImage,
            },
        });
    } catch (error) {
        console.error('회원가입 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 입력값 검증
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '이메일과 비밀번호를 모두 입력해주세요.',
            });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 이메일 형식입니다.',
            });
        }

        const user = await loadUsersModel(email, password);

        if (!user || user === '0') {
            return res.status(400).json({
                success: false,
                message: '잘못된 이메일 또는 비밀번호입니다.',
            });
        }

        req.session.user = {
            user_id: user.user_id,
            email: user.email,
            nickname: user.nickname,
            profileImage: user.image_url,
        };

        res.status(200).json({
            success: true,
            message: '로그인 성공!',
        });
    } catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export { signUp, login };
