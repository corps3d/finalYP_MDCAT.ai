const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');

// Create or update a quiz
router.post('/create', quizController.createQuiz);

// Get quiz by ID
router.get('/:userId', quizController.getUserQuizzes);

// Generate feedback
router.post('/feedback', quizController.generateFeedback);

router.delete('/:quizId', quizController.deleteQuiz);


module.exports = router;
