const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const MAX_CONTENT_LENGTH = 500;

// 驗證留言內容：回傳錯誤訊息，通過則回傳 null
function validateContent(content, emptyMessage) {
    if (typeof content !== 'string' || !content.trim()) {
        return emptyMessage;
    }

    if (content.trim().length > MAX_CONTENT_LENGTH) {
        return `留言內容不能超過 ${MAX_CONTENT_LENGTH} 字`;
    }

    return null;
}

// 將 Mongoose ValidationError 轉成 400 回應；非驗證錯誤回傳 false
function handleValidationError(err, res) {
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)[0];
        res.status(400).json({ message });
        return true;
    }

    return false;
}

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

        const contentError = validateContent(content, '訊息內容不能為空');
        if (contentError) {
            return res.status(400).json({ message: contentError });
        }

        const newMessage = new Message({
            user: req.userId,
            content: content.trim()
        });

        const message = await newMessage.save();
        const populatedMessage = await message.populate('user', 'username');
        res.json(populatedMessage);
    } catch (error) {
        if (handleValidationError(error, res)) return;

        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.put('/:messageId', auth, async (req, res) => {
    try {
        const { content } = req.body;

        const contentError = validateContent(content, '內容不能為空');
        if (contentError) {
            return res.status(400).json({ message: contentError });
        }

        // 將「作者」條件放進查詢，檢查與更新為單一原子操作
        const message = await Message.findOneAndUpdate(
            { _id: req.params.messageId, user: req.userId },
            { $set: { content: content.trim() } },
            { returnDocument: 'after', runValidators: true } // returnDocument: 'after' 回傳更新後的結果
        ).populate('user', 'username');

        if (!message) {
            // 查不到可能是留言不存在，或不是作者，失敗路徑才多查一次區分
            const exists = await Message.exists({ _id: req.params.messageId });

            if (!exists) {
                return res.status(404).json({ message: '找不到該留言' });
            }

            return res.status(403).json({ message: '權限不足' });
        }

        res.json(message);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '找不到該留言' });
        }

        if (handleValidationError(err, res)) return;

        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.delete('/:messageId', auth, async (req, res) => {
    try {
        // 將「作者」條件放進查詢，檢查與刪除為單一原子操作
        const message = await Message.findOneAndDelete({
            _id: req.params.messageId,
            user: req.userId
        });

        if (!message) {
            const exists = await Message.exists({ _id: req.params.messageId });

            if (!exists) {
                return res.status(404).json({ message: '找不到該留言' });
            }

            return res.status(403).json({ message: '權限不足，只能刪除自己的留言' });
        }

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