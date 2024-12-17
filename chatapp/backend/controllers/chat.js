const Chat = require('../models/chat');

const chatController = {
    // Create a new chat
    async createChat(req, res) {
        try {
            const { userId, chatName } = req.body;

            const newChat = new Chat({
                userId,
                chatName: chatName || 'New Chat',
                messages: [
                    {
                        sender: 'bot',
                        content: 'Hello! How can I help you?',
                        timestamp: new Date()
                    }
                ]
            });

            await newChat.save();

            res.status(201).json({
                success: true,
                message: 'New chat created successfully',
                data: newChat
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating new chat',
                error: error.message
            });
        }
    },


    async getAllChats(req, res) {
        try {
            const { userId } = req.params;

            const chats = await Chat.find({ userId })
                .select('chatName createdAt _id')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: chats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving chats',
                error: error.message
            });
        }
    },

    // Store a new message in specific chat
    async saveMessage(req, res) {
        try {
            const { chatId, sender, content } = req.body;

            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            chat.messages.push({
                sender,
                content,
                timestamp: new Date()
            });

            await chat.save();

            res.status(200).json({
                success: true,
                message: 'Message saved successfully',
                data: chat.messages[chat.messages.length - 1]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error saving message',
                error: error.message
            });
        }
    },

    // Get messages for a specific chat
    async getChatMessages(req, res) {
        try {
            const { chatId } = req.params;
            const { limit = 50, skip = 0 } = req.query;

            const chat = await Chat.findById(chatId)
                .slice('messages', [parseInt(skip), parseInt(limit)])
                .exec();

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    chatName: chat.chatName,
                    messages: chat.messages
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving chat messages',
                error: error.message
            });
        }
    },

    // Delete a specific chat
    async deleteChat(req, res) {
        try {
            const { chatId } = req.params;

            const result = await Chat.findByIdAndDelete(chatId);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Chat deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting chat',
                error: error.message
            });
        }
    },


    // Rename a chat
    async renameChat(req, res) {
        try {
            const { chatId } = req.params;
            const { chatName } = req.body;

            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            chat.chatName = chatName;
            await chat.save();

            res.status(200).json({
                success: true,
                message: 'Chat renamed successfully',
                data: { chatId, chatName }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error renaming chat',
                error: error.message
            });
        }
    },

    // Delete all chats for a specific user
    async deleteAllChats(req, res) {
        try {
            const { userId } = req.params;

            // Delete all chats associated with the user
            const result = await Chat.deleteMany({ userId });

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No chats found to delete for this user.'
                });
            }

            res.status(200).json({
                success: true,
                message: `${result.deletedCount} chats deleted successfully.`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting chats',
                error: error.message
            });
        }
    }

};


module.exports = chatController;
