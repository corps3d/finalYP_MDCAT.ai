const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],  
  correctOption: Number,  
  difficulty: String,  
  subject: String, 
});

module.exports = mongoose.model('Question', questionSchema);