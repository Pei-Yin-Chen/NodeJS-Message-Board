FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 告訴容器要開啟哪個門 (Port)
EXPOSE 5000
# 啟動指令：這行在容器啟動時才會執行
CMD ["npm", "start"]