const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
    }
}, { 
    // 加上這行，Mongoose 會自動幫你產生 createdAt 和 updatedAt
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);