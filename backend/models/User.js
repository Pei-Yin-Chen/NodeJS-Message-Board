const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email 是必須的'],
        unique: true, // 確保帳號不會重複
        trim: true, // 移除字串兩端的空白字元
        lowercase: true,
        match: [/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/, '請輸入有效的 Email 地址']
    },
    username: {
        type: String,
        required: [true, '使用者名稱是必須的'],
        trim: true,
        minlength: [2, '使用者名稱至少需要 2 個字'],
        maxlength: [20, '使用者名稱最多只能 20 個字'],
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    googleId: {
        type: String
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);