require('dotenv').config({ path: '.env.test' });

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// 所有測試開始前：開測試資料庫 + 連線
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    await mongoose.connect(process.env.MONGO_URI);
});

// 每個測試後：清空資料庫
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// 所有測試結束後：關閉資料庫連線 + 停止測試資料庫
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
