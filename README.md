# Message Board Full-stack Project
這是留言板專案的完整實作，包含 React 前端、Node.js/Express 後端 以及 Nginx 反向代理。本專案已全面容器化，支援使用 Docker 一鍵部署。

## 功能
- 使用 JWT 進行身分驗證 (Register/Login) 與 Google OAuth 第三方登入
- 個人資料頁修改暱稱（`PATCH /api/auth/profile`）
- 留言 CRUD 功能 (Create, Read, Update, Delete)
- 權限驗證：以 **userId** 比對，使用者僅能操作自己的留言
- 串接 Nginx 反向代理，徹底解決開發與部署環境的 CORS 跨網域問題

## 技術棧
- Frontend: React, TypeScript, Vite, MUI (Material UI)
- Backend: Node.js, Express, MongoDB (Mongoose)
- Infrastructure: Docker, Docker Compose, Nginx
- Auth: JWT (JSON Web Token) with HTTP-only Cookie

## 環境變數
請在 `backend/` 目錄下建立 `.env.production` 檔案並設定以下變數：
- NODE_ENV=production
- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- FRONTEND_URL=http://localhost
- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret

請在 `frontend/` 目錄下建立 `.env.production` 檔案並設定以下變數：
- VITE_GOOGLE_CLIENT_ID=your_google_client_id

## 模式 A：Docker 生產/測試指令(一鍵啟動)
- 啟動/更新容器：
```
docker compose up --build --force-recreate -d
```
(加上 `-d` 可以讓容器在背景執行，關閉終端機也不會中斷網頁運作)

- 停止並移除容器：
```
docker compose down
```

- 停止並徹底清除（重頭來過）：
```
docker compose down --rmi all
```

- 訪問網址：http://localhost (預設 Port 80，API 由 Nginx 自動分流)

## 模式 B：Local 開發指令
- 後端啟動：
```
cd backend && npm install && npm run dev
```
(監聽位址：http://localhost:5000)

- 前端啟動：
```
cd frontend && npm install && npm run dev
```
(監聽位址：http://localhost:5173。)

## API 路由說明

所有 API 前綴為 `/api`。登入後 JWT 會寫入 **HTTP-only Cookie**（`token`），需登入的路由請帶 `credentials: 'include'`（前端 axios 已設定）。

> 之後計畫補上 Swagger / OpenAPI 互動文件；目前以本節為準。

### 身分驗證 (Auth) — `/api/auth`

| 方法 | 路徑 | 需登入 | 說明 |
|------|------|--------|------|
| POST | `/register` | 否 | 註冊新帳號 |
| POST | `/login` | 否 | 登入，回傳使用者並設定 Cookie |
| POST | `/logout` | 否 | 清除 Cookie |
| GET | `/me` | 是 | 取得當前登入者資訊 |
| PATCH | `/profile` | 是 | 更新暱稱 |
| GET | `/google` | 否 | 導向 Google OAuth 授權頁 |
| GET | `/google/callback` | 否 | Google 回調，成功後設定 Cookie 並導回首頁 |

#### POST `/api/auth/register`

**Body**
```json
{
  "email": "user@example.com",
  "username": "nickname",
  "password": "password123"
}
```

- `username`：2～20 字（Mongoose Schema 驗證）
- 成功：`201`，`{ "message": "註冊成功" }`
- 常見錯誤：`400`（欄位缺失、Email 重複、格式或長度不符）

#### POST `/api/auth/login`

**Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- 成功：`200`，設定 Cookie，並回傳：
```json
{
  "user": {
    "id": "...",
    "username": "nickname",
    "email": "user@example.com",
    "createdAt": "..."
  }
}
```

#### GET `/api/auth/me`

- 成功：`200`，`{ "user": { "id", "username", "email", "createdAt" } }`
- 未登入：`401`

#### PATCH `/api/auth/profile`

**Body**
```json
{
  "username": "新暱稱"
}
```

- 成功：`200`，回傳更新後的 `user` 物件（格式同 login）
- 常見錯誤：`400`（暱稱為空、長度不符）、`401`（未登入）

#### Google OAuth

- 前端導向：`GET /api/auth/google`
- 成功：Cookie 寫入後 redirect 至 `/`（Nginx）或 `FRONTEND_URL`
- 失敗：redirect 至 `/login?error=access_denied` 或 `oauth_failed`

---

### 留言管理 (Messages) — `/api/messages`

| 方法 | 路徑 | 需登入 | 說明 |
|------|------|--------|------|
| GET | `/` | 否 | 取得所有留言（新到舊） |
| POST | `/` | 是 | 新增留言 |
| PUT | `/:messageId` | 是 | 修改留言（僅限本人） |
| DELETE | `/:messageId` | 是 | 刪除留言（僅限本人） |

#### GET `/api/messages`

- 成功：`200`，留言陣列。每則留言的 `user` 為 populate 後的作者資訊：
```json
{
  "_id": "...",
  "content": "留言內容",
  "user": {
    "_id": "...",
    "username": "nickname"
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### POST `/api/messages`

**Body**
```json
{
  "content": "留言內容"
}
```

- 成功：`200`，回傳新建的留言（含 populate 的 `user`）
- 常見錯誤：`400`（內容為空）、`401`（未登入）

#### PUT `/api/messages/:messageId`

**Body**
```json
{
  "content": "更新後的內容"
}
```

- 成功：`200`，回傳更新後的留言
- 常見錯誤：`401`（非本人或未登入）、`404`（找不到留言）

#### DELETE `/api/messages/:messageId`

- 成功：`200`，`{ "message": "留言已成功刪除" }`
- 常見錯誤：`401`（非本人或未登入）、`404`（找不到留言）

---

### 後端測試

```bash
cd backend && npm test
```

測試涵蓋 Auth 與 Messages 主要路由（含改暱稱、權限、驗證錯誤等）。

## Nginx 反向代理
本專案使用 Nginx 作為進入點，統一管理前後端路徑：
- `/`：導向前端 React 應用
- `/api/`：自動轉發至 `http://backend:5000`