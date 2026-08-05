// 引入 dotenv 並執行設定：讀取資料夾中的 .env 檔案，將裡面的變數放入 process.env 中
require('dotenv').config();

// 引入 mongoose 套件：連接 MongoDB 資料庫
const mongoose = require('mongoose');

const app = require('./app');

const PORT = process.env.PORT || 5000;

// 連接 MongoDB 資料庫
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        // 啟動伺服器
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    });