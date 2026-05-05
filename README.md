# Message Board Backend
這是留言板專案的後端 API，使用 Node.js, Express 與 MongoDB 建立。

## 功能
- 使用 JWT 進行身分驗證 (Register/Login)
- 留言 CRUD 功能 (Create, Read, Update, Delete)
- 權限驗證：使用者僅能操作自己的留言

## 環境變數
請建立 `.env` 檔案並設定以下變數：
- MONGO_URI
- JWT_SECRET
- PORT