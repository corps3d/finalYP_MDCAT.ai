const Question = require("../models/Question");

// Controller to add a new question
exports.addQuestion = async (req, res) => {
  const { question, options, correctOption, difficulty, subject } = req.body;

  // Validate the request data
  if (
    !question ||
    !options ||
    options.length !== 4 ||
    !correctOption ||
    !difficulty ||
    !subject
  ) {
    return res.status(400).json({
      message: "All fields are required and options should contain 4 items",
    });
  }

  // Ensure that the correctOption is within the bounds of the options array
  if (correctOption < 0 || correctOption >= options.length) {
    return res.status(400).json({ message: "Invalid correctOption index" });
  }

  try {
    const newQuestion = new Question({
      question,
      options,
      correctOption,
      difficulty,
      subject,
    });
    await newQuestion.save();
    res
      .status(201)
      .json({ message: "Question added successfully", newQuestion });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add question", error: error.message });
  }
};

// Controller to get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch questions", error: error.message });
  }
};

// Controller to get a specified number of random questions
exports.getRandomQuestions = async (req, res) => {
  const { number } = req.params;

  // Ensure the number parameter is a positive integer
  const numQuestions = parseInt(number, 10);
  if (isNaN(numQuestions) || numQuestions <= 0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid positive number" });
  }

  try {
    // Use MongoDB's aggregation pipeline to fetch random questions
    const questions = await Question.aggregate([
      { $sample: { size: numQuestions } },
    ]);

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch questions", error: error.message });
  }
};

// Controller to delete a question by ID
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion)
      return res.status(404).json({ message: "Question not found" });

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete question", error: error.message });
  }
};

// Controller to get questions by subject
exports.getQuestionsBySubject = async (req, res) => {
  const { subject } = req.params;

  if (!subject) {
    return res.status(400).json({ message: "Subject parameter is required" });
  }

  try {
    const questions = await Question.find({ subject: subject });

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this subject" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch questions", error: error.message });
  }
};

// Controller to get a specified number of random questions by subject
exports.getRandomQuestionsBySubject = async (req, res) => {
  const { subject, number } = req.params;

  const numQuestions = parseInt(number, 10);
  if (isNaN(numQuestions) || numQuestions <= 0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid positive number" });
  }

  try {
    const questions = await Question.aggregate([
      { $match: { subject } }, // Filter by subject
      { $sample: { size: numQuestions } }, // Randomly select specified number
    ]);

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this subject" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch random questions",
      error: error.message,
    });
  }
};

// Controller to get a random question by subject and difficulty
exports.getQuestionByDifficultySubject = async (req, res) => {
  const { subject, difficulty } = req.params;

  if (!subject || !difficulty) {
    return res
      .status(400)
      .json({ message: "Subject and difficulty parameters are required" });
  }

  try {
    const question = await Question.aggregate([
      {
        $match: {
          subject: { $regex: new RegExp(`^${subject}$`, "i") },
          difficulty: { $regex: new RegExp(`^${difficulty}$`, "i") },
        },
      }, // Filter by subject and difficulty
      { $sample: { size: 1 } }, // Randomly select one question
    ]);

    if (question.length === 0) {
      return res
        .status(404)
        .json({ message: "No question found for this subject and difficulty" });
    }

    res.status(200).json(question[0]); // Return only the first (and only) question in the array
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch question", error: error.message });
  }
};

// Controller to get a random question by difficulty from all subjects
exports.getQuestionByDifficulty = async (req, res) => {
  const { difficulty } = req.params;

  if (!difficulty) {
    return res
      .status(400)
      .json({ message: "Difficulty parameter is required" });
  }

  try {
    const question = await Question.aggregate([
      {
        $match: {
          difficulty: { $regex: new RegExp(`^${difficulty}$`, "i") },
        },
      }, // Filter by difficulty
      { $sample: { size: 1 } }, // Randomly select one question
    ]);

    if (question.length === 0) {
      return res
        .status(404)
        .json({ message: "No question found for this difficulty" });
    }

    res.status(200).json(question[0]); // Return only the first (and only) question in the array
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch question", error: error.message });
  }
};
