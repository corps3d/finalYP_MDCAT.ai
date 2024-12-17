const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    userAnswer: Number
})

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [quizQuestionSchema],
    feedBack: String,
    Score: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Quiz', quizSchema);
