// 引入 express 框架：這是一個 Node.js 的 Web 框架，簡化了處理 HTTP 請求的流程
const express = require('express');
// 引入 cors 套件：解決「跨來源資源共用」問題（讓你的前端 React 5173 埠號可以連到後端 5000 埠號）
const cors = require('cors');
const cookieParser = require('cookie-parser');
// 引入 dotenv 並執行設定：讀取資料夾中的 .env 檔案，將裡面的變數放入 process.env 中
require('dotenv').config();

// 建立 express 的實例（App 物件）
const app = express();
// 設定埠號：優先讀取環境變數中的 PORT，如果沒有則預設使用 5000
const PORT = process.env.PORT || 5000;

// 引入 mongoose 套件：連接 MongoDB 資料庫
const mongoose = require('mongoose');
// 連接 MongoDB 資料庫
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

// 中間件 Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true // 允許跨域交換 Cookie
}));
app.use(cookieParser());
app.use(express.json()); // 讓你能解析 JSON 格式的 Request Body

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');

// 路由 Route
app.get('/', (req, res) => {
    res.send('Hello World');
});
// 這代表所有 auth.js 裡的路由都會加上 /api/auth 前綴
app.use('/api/auth', authRoutes);
// 這代表所有 message.js 裡的路由都會加上 /api/message 前綴
app.use('/api/messages', messageRoutes);

// 啟動伺服器
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));