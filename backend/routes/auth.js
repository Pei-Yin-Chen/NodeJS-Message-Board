const express = require('express');
const router = express.Router(); // 建立一個路由器實例
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 引入 User 模型

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查使用者是否已經存在
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: '使用者已經存在' });
        }

        // 密碼加密 (Hash)
        const salt = await bcrypt.genSalt(10); // 生成一個隨機的鹽
        const hashedPassword = await bcrypt.hash(password, salt); // 將密碼加密

        // 建立並儲存使用者
        user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: '註冊成功' });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查使用者是否存在
        const user = await User.findOne({ username });
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

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            }
        });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
});

module.exports = router; // 導出路由器實例