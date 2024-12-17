const fs = require('fs');
const path = require('path');
const Subject = require('../models/Subject');
const Question = require('../models/Question');

// Controller function to import data from the subject JSON file (phy_content_data.json)
// phy_content = done
// bio data = done
// chemistry = done
// eng = done
// LR = done
exports.importDataFromFile = async (req, res) => {
  try {
    // Read the JSON file from the backend folder
    const filePath = path.resolve('C:/Users/PMLS/Documents/mdcat.ai-main/chatapp/backend/LR_content_data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Manually set the subject name
    const subjectname = 'LogicalReasoning';

    // Create a new Subject document with the imported data
    const subject = new Subject({
      subjectname,
      topics: data.topics
    });

    // Save the Subject to the database
    await subject.save();

    res.status(201).json({ message: 'Data imported successfully', subject });
  } catch (error) {
    console.error('Error importing data:', error.message);
    res.status(500).json({ error: 'Failed to import data', details: error.message });
  }
};






//MCQS Bio & PHYS = ADDED


// Controller function to import MCQs data from the bio_mcqs_data.json
exports.importMCQsFromFile = async (req, res) => {
  try {
    // Path to the MCQs JSON file
    const filePath = path.resolve('C:/Users/PMLS/Documents/mdcat.ai-main/chatapp/backend/bio_mcqs_data.json');
    
    // Read the JSON file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Map the MCQs data into the format expected by the Question schema
    const questions = data.map(item => ({
      question: item.question,
      A: item.A,
      B: item.B,
      C: item.C,
      D: item.D,
      correct: item.correct,
      subject: item.subject || 'Biology'  // Add subject if it's missing in your data
    }));

    // Insert the questions into the database
    await Question.insertMany(questions);

    res.status(201).json({ message: 'MCQs data imported successfully', count: questions.length });
  } catch (error) {
    console.error('Error importing MCQs data:', error.message);
    res.status(500).json({ error: 'Failed to import MCQs data', details: error.message });
  }
};
