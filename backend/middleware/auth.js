const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 從 Cookie 中取得 Token
    const token = req.cookies.token;

    // 檢查是否有 Token
    if (!token) {
        return res.status(401).json({ message: '沒有登入權限' });
    }

    try {
        // 驗證 Token 並解碼
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 將使用者 ID 統一存在 req.userId，路由不需要再判斷 payload 欄位
        req.userId = decoded.id;

        if (!req.userId) {
            return res.status(401).json({ message: '無效的 Token' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: '無效的 Token' });
    }
};