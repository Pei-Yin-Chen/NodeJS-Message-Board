const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('user', ['username'])
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        res.status.json({ message: '取得資料失敗' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: '訊息內容不能為空' });
        }

        const newMessage = new Message({
            user: req.userId, // 這是從 auth middleware 存入 req 的資料
            content
        });

        const message = await newMessage.save();
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.put('/:messageId', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: '內容不能為空' });
        }

        let message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ message: '找不到該留言' });
        }

        // 權限檢查：只能修改自己的留言
        if (message.user.toString() !== req.userId) {
            return res.status(401).json({ message: '權限不足' });
        }

        // 使用 findByIdAndUpdate 可以直接回傳更新後的資料
        message = await Message.findByIdAndUpdate(
            req.params.id,
            { $set: { content: content } },
            { new: true } // 這個參數代表回傳「更新後」的結果，而不是舊的
        )

        res.json(message);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '找不到該留言' });
        }
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.delete('/:messageId', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ message: '找不到該留言' });
        }

        // 權限檢查：比對「留言的作者 ID」是否等於「目前登入的使用者 ID」
        // 注意：message.user 是 ObjectId 物件，req.userId 是字串，所以要轉成字串比對
        if (message.user.toString() !== req.userId) {
            return res.status(401).json({ message: '權限不足，只能刪除自己的留言' });
        }

        await message.deleteOne();

        res.json({ message: '留言已成功刪除' });
    } catch (err) {
        // 如果傳入的 ID 格式錯誤 (CastError)，也會進到這裡
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '找不到該留言' });
        }
        res.status(500).json({ message: '伺服器錯誤' });
    }
})

module.exports = router;