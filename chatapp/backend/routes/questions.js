const express = require('express');
const router = express.Router();
const {
  addQuestion,
  getRandomQuestions,
  getAllQuestions,
  deleteQuestion,
  getQuestionsBySubject,
  getRandomQuestionsBySubject,
  getQuestionByDifficultySubject,
  getQuestionByDifficulty
} = require('../controllers/question.js');

router.post('/add-questions', addQuestion);

router.get('/getAllMcqs', getAllQuestions);

router.get('/getRandomMcqs/:number', getRandomQuestions);

router.delete('/deleteQuestion/:id', deleteQuestion);

router.get('/getMcqsBySubject/:subject', getQuestionsBySubject);

router.get('/getRandomMcqsBySubject/:subject/:number', getRandomQuestionsBySubject);

router.get('/getQuestionByDifficulty/:difficulty/:subject?', (req, res) => {
  const { subject, difficulty } = req.params;
  
  if (subject) {
      getQuestionByDifficultySubject(req, res);
  } else {
      getQuestionByDifficulty(req, res);
  }
});


module.exports = router;