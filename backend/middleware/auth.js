const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 從 Header 取得 Token (通常放在 Authorization 欄位)
    const token = req.header('Authorization')?.split(' ')[1]; // 格式通常是 "Bearer <token>"

    // 檢查是否有 Token
    if (!token) {
        return res.status(401).json({ message: '沒有登入權限' });
    }

    try {
        // 驗證 Token 並解碼
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 將使用者 ID 儲存在 req.userId 中，以便在路由中使用
        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(401).json({ message: '無效的 Token' });
    }
};