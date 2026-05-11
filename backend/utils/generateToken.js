const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  // 使用者 ID 作為 Payload，並設定過期時間
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // 一小時後過期
  });
};

module.exports = generateToken;