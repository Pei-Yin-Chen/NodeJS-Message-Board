# 第一階段：編譯階段 (Build Stage)
# 1. 選擇底層系統：用 Node 24 版的輕量化 Linux
FROM node:24-alpine AS build-stage

# 2. 設定工作目錄：接下來的操作都在這資料夾下執行
WORKDIR /app

# 3. 複製 package.json：先安裝依賴
COPY package*.json ./

# 4. 安裝套件：在容器裡面執行 npm install
RUN npm install

# 5. 複製所有程式碼：把你的 React/Vue 原始碼丟進去
COPY . .

# 6. 打包：產出靜態檔案 (dist 資料夾)
RUN npm run build

# 第二階段：生產階段 (Production Stage)
# 使用 Nginx 來提供靜態檔案
FROM nginx:alpine

# 從第一階段(build-stage)產出的檔案，複製到 Nginx 的目錄下
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 把電腦的 80 對接到容器的 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]