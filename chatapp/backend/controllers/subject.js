const Subject = require('../models/Subject');

// Controller to add a new subject with topics and subtopics
const addSubject = async (req, res) => {
  try {
    const { subjectname, topics } = req.body;

    const subject = new Subject({
      subjectname,
      topics
    });

    await subject.save();
    res.status(201).json({ message: 'Subject added successfully', subject });
  } catch (error) {
    res.status(500).json({ error: 'Error adding subject', details: error.message });
  }
};

// Controller to get all subjects with topics and subtopics
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subjects', details: error.message });
  }
};

// Controller to get a specific subject by name
const getSubjectByName = async (req, res) => {
  try {
    const { subjectName } = req.params;
    const subject = await Subject.findOne({ subjectname: subjectName });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subject', details: error.message });
  }
};

// Controller to get a specific topic within a subject
const getTopicBySubjectAndTopicName = async (req, res) => {
  try {
    const { subjectName, topicName } = req.params;
    const subject = await Subject.findOne({ subjectname: subjectName });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    const topic = subject.topics.find(t => t.topicname === topicName);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching topic', details: error.message });
  }
};

// Controller to get preparation material for a specific subtopic
const getPreparationMaterialBySubtopic = async (req, res) => {
  try {
    const { subjectName, topicName, subtopicName } = req.params;
    const subject = await Subject.findOne({ subjectname: subjectName });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    const topic = subject.topics.find(t => t.topicname === topicName);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const subtopic = topic.subtopics.find(st => st.subtopicname === subtopicName);
    if (!subtopic) {
      return res.status(404).json({ error: 'Subtopic not found' });
    }

    res.status(200).json({ preparationMaterial: subtopic.preparationMaterial });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching preparation material', details: error.message });
  }
};
const getSubtopicByName = async (req, res) => {
    try {
      const { subtopicName } = req.params;
      
      // Query to search for the subtopic by name across all subjects and topics
      const subject = await Subject.findOne({
        "topics.subtopics.subtopicname": subtopicName
      }, {
        "subjectname": 1, // Select only the relevant fields to minimize data
        "topics.topicname": 1,
        "topics.subtopics.$": 1 // Use the positional operator to get the specific matching subtopic
      });
  
      // Check if a matching subtopic was found
      if (!subject) {
        return res.status(404).json({ error: 'Subtopic not found' });
      }
  
      res.status(200).json(subject);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching subtopic', details: error.message });
    }
  };
  // Controller to get content of a specific subtopic within a subject and topic
const getContentBySubtopic = async (req, res) => {
  try {
    const { subjectName, topicName, subtopicName } = req.params;

    // Find the subject by its name
    const subject = await Subject.findOne({ subjectname: subjectName });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Find the topic within the subject
    const topic = subject.topics.find(t => t.topic_name === topicName);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Find the subtopic within the topic
    const subtopic = topic.subtopics.find(st => st.name === subtopicName);
    if (!subtopic) {
      return res.status(404).json({ error: 'Subtopic not found' });
    }

    // Return the content of the subtopic
    res.status(200).json({ content: subtopic.content });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subtopic content', details: error.message });
  }
};

  module.exports = {
    addSubject,
    getAllSubjects,
    getSubjectByName,
    getTopicBySubjectAndTopicName,
    getPreparationMaterialBySubtopic,
    getSubtopicByName,
    getContentBySubtopic
  };
