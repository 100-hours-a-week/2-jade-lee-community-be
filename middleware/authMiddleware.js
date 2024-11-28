const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(400).json({ message: '로그인이 필요합니다.' }); // 로그인되지 않은 경우 400 반환
    }
};
export default authMiddleware;
