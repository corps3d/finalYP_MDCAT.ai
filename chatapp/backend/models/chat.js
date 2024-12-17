const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        enum: ['user', 'bot']
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chatName: {
        type: String,
        required: true,
        default: 'New Chat'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    messages: [messageSchema]
});

// Create indexes for better query performance
chatSchema.index({ userId: 1, chatName: 1 });
chatSchema.index({ 'messages.timestamp': 1 });

module.exports = mongoose.model('Chat', chatSchema);
