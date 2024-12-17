const Quiz = require("../models/quiz");
const Question = require("../models/Question");
const axios = require("axios");
require("dotenv").config();

exports.createQuiz = async (req, res) => {
  try {
    const { userId, questions, score } = req.body;

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Please attempt questions first." });
    }

    // Validate each question in the array
    const validQuestions = await Promise.all(
      questions.map(async ({ questionId, userAnswer }) => {
        const question = await Question.findById(questionId);
        if (!question) {
          return null; 
        }
        return { question: questionId, userAnswer };
      })
    );

    // Filter out invalid questions
    const filteredQuestions = validQuestions.filter((q) => q !== null);
    if (filteredQuestions.length === 0) {
      return res.status(400).json({ message: "No valid questions provided." });
    }

    // Create the new quiz object
    const newQuiz = await Quiz.create({
      userId,
      questions: filteredQuestions,
      feedBack: "",
      Score: score,
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find and delete the quiz by ID
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ message: "Quiz deleted successfully", quiz: deletedQuiz });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res
      .status(500)
      .json({ message: "Error deleting quiz", error: error.message });
  }
};

// Controller function to fetch quizzes for a specific user
exports.getUserQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    const quizzes = await Quiz.find({ userId }).populate({
      path: "questions.question",
      model: "Question",
    });

    if (!quizzes || quizzes.length === 0) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this user." });
    }

    return res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "An error occurred while fetching quizzes.",
        error: error.message,
      });
  }
};

exports.generateFeedback = async (req, res) => {
  try {
    const { quizId } = req.body;

    // Fetch the quiz by ID
    const quiz = await Quiz.findById(quizId).populate({
      path: "questions.question",
      model: "Question",
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // If feedback already exists, return it
    if (quiz.feedBack) {
      return res.status(200).json({ feedback: quiz.feedBack });
    }

    const modified = JSON.parse(JSON.stringify(quiz));
    modified.questions.forEach((q) => {
      const selectedOption = q.question.options[q.userAnswer];
      q.userAnswer = selectedOption;
      const correctOpt = q.question.options[q.question.correctOption];
      q.question.correctOption = correctOpt;
    });

    // If no feedback exists, call the LLM endpoint
    const llmResponse = await axios.post(
      `${process.env.URL}/llm/feedback`,
      {
        modified,
      }
    );

    if (llmResponse.status !== 200 || !llmResponse.data.feedback) {
      return res
        .status(500)
        .json({ message: "Error fetching feedback from LLM" });
    }

    const feedback = llmResponse.data.feedback;
    quiz.feedBack = feedback;
    await quiz.save();

    // Return the feedback
    return res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return res
      .status(500)
      .json({ message: "Error generating feedback", error: error.message });
  }
};
