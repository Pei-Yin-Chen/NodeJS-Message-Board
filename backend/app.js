// 引入 express 框架：這是一個 Node.js 的 Web 框架，簡化了處理 HTTP 請求的流程
const express = require('express');
// 引入 cors 套件：解決「跨來源資源共用」問題（讓你的前端 React 5173 埠號可以連到後端 5000 埠號）
const cors = require('cors');
const cookieParser = require('cookie-parser');

const passport = require('passport');
require('./config/passport');

// 建立 express 的實例（App 物件）
const app = express();
app.set('trust proxy', true);

// 中間件 Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true // 允許跨域交換 Cookie
}));
app.use(cookieParser());
app.use(express.json()); // 解析 JSON 格式的 Request Body
app.use(passport.initialize()); // 啟動 Passport

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');

// 路由 Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});
// 這代表所有 auth.js 裡的路由都會加上 /api/auth 前綴
app.use('/api/auth', authRoutes);
// 這代表所有 message.js 裡的路由都會加上 /api/message 前綴
app.use('/api/messages', messageRoutes);

module.exports = app;