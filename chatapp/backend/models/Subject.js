const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true } 
});

const topicSchema = new mongoose.Schema({
  topic_name: { type: String, required: true },
  subtopics: [subtopicSchema] 
});

const subjectSchema = new mongoose.Schema({
  subjectname: { type: String, required: true },
  topics: [topicSchema] 
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;