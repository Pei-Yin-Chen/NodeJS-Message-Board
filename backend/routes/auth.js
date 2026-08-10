const express = require('express');
const router = express.Router(); // 建立一個路由器實例
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 引入 User 模型
const protect = require('../middleware/auth');
const passport = require('passport');
const generateToken = require('../utils/generateToken');

router.get('/me', protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId || req.user._id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: '找不到使用者' })
        }

        res.json({
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: '獲取使用者資料失敗' });
    }
})

router.patch('/profile', protect, async (req, res) => {
    try {
        const { username } = req.body;

        if (username === undefined || username === null) {
            return res.status(400).json({ message: '暱稱為必填' });
        }

        const trimmed = String(username).trim();

        if (!trimmed) {
            return res.status(400).json({ message: '暱稱不能為空' });
        }

        const userId = req.user.id || req.user.userId || req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: '找不到使用者' });
        }

        user.username = trimmed;
        await user.save();

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message)[0];
            return res.status(400).json({ message });
        }

        res.status(500).json({ message: '更新使用者資料失敗' });
    }
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: '所有欄位皆為必填' });
        }

        // 檢查 email 是否已經存在
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: '該 Email 已被註冊' });
        }

        // 密碼加密 (Hash)
        const salt = await bcrypt.genSalt(10); // 生成一個隨機的鹽
        const hashedPassword = await bcrypt.hash(password, salt); // 將密碼加密

        // 建立並儲存使用者
        user = new User({
            email,
            username,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: '註冊成功' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message)[0];
            return res.status(400).json({ message });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: '該 Email 已被註冊' });
        }

        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 檢查使用者是否存在
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '帳號或密碼錯誤' });
        }

        // 比對密碼 (將輸入的明碼與資料庫的雜湊碼比對)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '帳號或密碼錯誤' });
        }

        // 簽發 JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: '登入程序出錯', error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: '登出成功' });
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    // prompt: 'select_account'
    prompt: 'consent' // 強制顯示「您是否允許此應用程式...」的確認頁
}));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        // 處理「取消授權」或「認證失敗」
        if (err || !user) {
            console.log('Google Auth Failed Info:', info);

            // 判斷是否為使用者拒絕授權 (access_denied)
            // info 通常會包含 Google 回傳的原始錯誤訊息
            const isDenied = info?.message?.includes('access_denied') || !user;
            const errorParam = isDenied ? 'access_denied' : 'oauth_failed';

            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorParam}`);
        }

        // 認證成功，執行登入邏輯
        try {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000
            });

            // 成功後導回前端首頁
            return res.redirect(process.env.FRONTEND_URL);
        } catch (error) {
            console.error('Token Generation Error:', error);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }
    })(req, res, next);
});

module.exports = router; // 導出路由器實例