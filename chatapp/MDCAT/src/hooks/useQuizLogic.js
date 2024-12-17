import { useState, useEffect, useCallback } from "react";
import { Alert, BackHandler } from "react-native";
import client from "../utils/api/client";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const SECONDS_PER_QUESTION = 60;

const useQuizLogic = ({ navigation, subject, user, API_BASE_URL }) => {
  const [quizState, setQuizState] = useState({
    setupMode: true,
    questionCount: 5,
    currentQuestionIndex: 0,
    selectedOption: null,
    score: 0,
    showScoreModal: false,
    showNextButton: false,
    question: {},
    loading: true,
    timer: SECONDS_PER_QUESTION,
    isTimeUp: false,
    errorMessage: "",
    quizQuestions: [],
  });

  const resetQuizState = useCallback(() => {
    setQuizState({
      setupMode: true,
      questionCount: 5,
      currentQuestionIndex: 0,
      selectedOption: null,
      score: 0,
      showScoreModal: false,
      showNextButton: false,
      question: {},
      timer: SECONDS_PER_QUESTION,
      isTimeUp: false,
      errorMessage: "",
      quizQuestions: [],
    });
  }, []);

  const fetchQuestions = async () => {
    try {
      setQuizState((prev) => ({
        ...prev,
        loading: true,
        setupMode: false,
        errorMessage: "",
      }));
      const { data: nextQuestion } = await axios.post(
        `${API_BASE_URL}/rl/next`,
        subject
          ? { user_id: user._id, current_subject: subject }
          : { user_id: user._id }
      );
      {
        console.log(nextQuestion);
      }
      

      const q = res.data;
      const question = {
        id: q._id,
        question: q.question,
        options: q.options,
        correctOption: q.correctOption,
        difficulty: q.difficulty,
        subject: q.subject,
      };

      setQuizState((prev) => ({
        ...prev,
        question: question,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuizState((prev) => ({
        ...prev,
        errorMessage: "Failed to load questions. Please check your connection.",
        loading: false,
      }));
    }
  };

  // Timer effect
  useEffect(() => {
    let timerInterval;

    if (!quizState.setupMode && !quizState.loading) {
      timerInterval = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timer <= 1) {
            // Clear timer immediately when time runs out
            clearInterval(timerInterval);

            return {
              ...prev,
              timer: 0,
              isTimeUp: true,
            };
          }

          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [quizState.setupMode, quizState.loading, setQuizState]);

  const handleTimeUp = async () => {
    // Mark question as incorrect when time is up
    await axios.post(`${API_BASE_URL}/rl/update`, {
      user_id: user._id,
      correct: false,
    });
    setQuizState((prev) => ({
      ...prev,
      userAnswer: -1,
    }));
    // Automatically move to next question
    const nextIndex = quizState.currentQuestionIndex + 1;

    if (nextIndex < quizState.questionCount) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedOption: null,
        showNextButton: false,
        timer: SECONDS_PER_QUESTION,
        isTimeUp: false,
        quizQuestions: [
          ...prev.quizQuestions,
          {
            question: prev.question.id,
            userAnswer: null,
          },
        ],
      }));
      fetchQuestions();
    } else {
      setQuizState((prev) => ({ ...prev, showScoreModal: true }));

      navigation.navigate("Quiz");
    }
  };

  return {
    quizState,
    setQuizState,
    resetQuizState,
    fetchQuestions,
    resetQuizState,
  };
};

export default useQuizLogic;
