const express = require('express');
const router = express.Router();
const {
  addSubject,
  getAllSubjects,
  getSubjectByName,
  getTopicBySubjectAndTopicName,
  getContentBySubtopic, 
  getSubtopicByName
} = require('../controllers/subject.js');

router.post('/add-subject', addSubject);

router.get('/getAllSubjects', getAllSubjects);

router.get('/getSubject/:subjectName', getSubjectByName);

router.get('/getSubject/:subjectName/topic/:topicName', getTopicBySubjectAndTopicName);

router.get('/getSubject/:subjectName/topic/:topicName/subtopic/:subtopicName', getContentBySubtopic);


router.get('/getSubtopicByName/:subtopicName', getSubtopicByName);

module.exports = router;
