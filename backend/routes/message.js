const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/', async (req, res) => {
    try {
        const { cursor } = req.query;
        let limit = parseInt(req.query.limit, 10);

        if (Number.isNaN(limit)) {
            limit = 10;
        }

        if (limit < 1 || limit > 50) {
            return res.status(400).json({ message: '留言數量必須在 1 到 50 之間' });
        }

        let filter = {};

        if (cursor) {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({ message: '無效的 cursor' });
            }

            const cursorMsg = await Message.findById(cursor);

            if (!cursorMsg) {
                return res.status(404).json({ message: '找不到對應的留言' });
            }

            filter = {
                $or: [
                    { createdAt: { $lt: cursorMsg.createdAt } },
                    {
                        createdAt: cursorMsg.createdAt,
                        _id: { $lt: cursorMsg._id }
                    }
                ]
            };
        }

        const messages = await Message.find(filter)
            .populate('user', ['username'])
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1);

        const hasMore = messages.length > limit;
        const pageMessages = hasMore ? messages.slice(0, limit) : messages;
        const nextCursor = hasMore
            ? pageMessages[pageMessages.length - 1]._id.toString()
            : null;

        res.json({
            messages: pageMessages,
            nextCursor,
            hasMore,
        });
    } catch (err) {
        res.status(500).json({ message: '取得資料失敗' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: '訊息內容不能為空' });
        }

        const userId = req.user.id || req.user.userId || req.user._id;

        if (!userId) {
            return res.status(401).json({ message: '無效的使用者資訊' });
        }

        const newMessage = new Message({
            user: userId, // 這是從 auth middleware 存入 req 的資料
            content
        });

        const message = await newMessage.save();
        const populatedMessage = await message.populate('user', 'username');
        res.json(populatedMessage);
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
        if (message.user.toString() !== (req.user.userId || req.user.id || req.user._id)) {
            return res.status(401).json({ message: '權限不足' });
        }

        // 使用 findByIdAndUpdate 可以直接回傳更新後的資料
        message = await Message.findByIdAndUpdate(
            req.params.messageId,
            { $set: { content: content } },
            { new: true } // 這個參數代表回傳「更新後」的結果，而不是舊的
        ).populate('user', 'username');

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
        // 注意：message.user 是 ObjectId 物件，req.user.user.userId 是字串，所以要轉成字串比對
        if (message.user.toString() !== (req.user.userId || req.user.id || req.user._id)) {
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