import React, { useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  BackHandler,
  View,
} from "react-native";
import useQuizLogic from "../hooks/useQuizLogic";
import QuestionBox from "../components/quiz/QuestionBox";
import OptionsList from "../components/quiz/OptionsList";
import ScoreModal from "../components/quiz/ScoreModal";
import quizStyles from "../styles/quizStyles";
import SetupScreen from "../components/quiz/SetupScreen";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import client from "../utils/api/client";
import AnimatedThinkingEmoji from "../components/quiz/AnimatedThinkingEmoji";
import { PYTHON } from "@env";

const Quiz = ({ navigation, route }) => {
  const { user } = useAuth();
  const { subject, testType } = route.params;
  const API_BASE_URL = PYTHON;
  const scrollViewRef = useRef(null); // Add a ref for the ScrollView

  useFocusEffect(
    useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [])
  );

  const { quizState, setQuizState, fetchQuestions, resetQuizState } =
    useQuizLogic({
      navigation,
      subject,
      user,
      API_BASE_URL,
    });

  const validateAnswer = async (selectedOptionIndex) => {
    if (quizState.isTimeUp) return;

    const currentQuestion = quizState.question;
    const isCorrect = selectedOptionIndex === currentQuestion.correctOption;
    console.log(quizState);
    setQuizState((prev) => ({
      ...prev,
      selectedOption: selectedOptionIndex,
      showNextButton: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      quizQuestions: [
        ...prev.quizQuestions,
        {
          questionId: currentQuestion.id,
          userAnswer: selectedOptionIndex,
        },
      ],
    }));
  };

  useEffect(() => {
    if (!quizState.setupMode) {
      navigation.setOptions({ tabBarStyle: { height: 0, display: "none" } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: "#F1F2F6",
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.6,
          shadowRadius: 20,
          height: 70,
          borderRadius: 15,
          marginBottom: 10,
        },
      });
    }

    return () => {
      // Reset tab bar visibility when leaving the quiz screen
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: "#F1F2F6",
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.6,
          shadowRadius: 20,
          height: 70,
          borderRadius: 15,
          marginBottom: 10,
        },
      });
    };
  }, [quizState.setupMode, navigation]);

  const useHandleLeaveQuiz = (
    quizState,
    setQuizState,
    navigation,
    API_BASE_URL
  ) => {
    useFocusEffect(
      React.useCallback(() => {
        const handleBackPress = () => {
          if (!quizState.setupMode && quizState.currentQuestionIndex >= 0) {
            // Show the alert if the quiz is ongoing
            Alert.alert(
              "Leave Quiz",
              "Are you sure you want to leave this quiz? Progress will not be saved.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Leave Quiz",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      if (quizState.quizId) {
                        // Delete the current quiz from the database
                        await client.delete(`/quiz/${quizState.quizId}`);
                      }

                      setQuizState((prev) => ({
                        ...prev,
                        setupMode: true,
                        question: {},
                        currentQuestionIndex: 0,
                        score: 0,
                        selectedOption: null,
                        showNextButton: false,
                        timer: 60, // Reset timer
                        isTimeUp: false,
                        errorMessage: "",
                        quizQuestions: [],
                      }));
                    } catch (error) {
                      console.error("Error leaving quiz:", error);
                      Alert.alert(
                        "Error",
                        "Failed to leave quiz. Please try again."
                      );
                    }
                  },
                },
              ]
            );
            return true; // Prevent default back button action
          }
          return false; // Allow default behavior if not in quiz mode
        };

        // Add the back button listener
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        // Cleanup listener on unmount
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      }, [quizState, setQuizState, navigation, API_BASE_URL])
    );
  };

  const handleNext = async () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    if (nextIndex < quizState.questionCount) {
      fetchQuestions();
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedOption: null,
        showNextButton: false,
        timer: 60,
        isTimeUp: false,
      }));
    } else {
      try {
        const response = await client.post("/quiz/create", {
          userId: user._id,
          questions: quizState.quizQuestions,
          score: quizState.score,
        });

        console.log("Quiz saved:", response.data);
        setQuizState((prev) => ({ ...prev, showScoreModal: true }));
      } catch (error) {
        console.error("Error saving quiz:", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      resetQuizState();
      return () => {};
    }, [resetQuizState])
  );

  const restartQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      showScoreModal: false,
      currentQuestionIndex: 0,
      score: 0,
      selectedOption: null,
      quizQuestions: [],
    }));
    fetchQuestions();
  };

  // Use the leave quiz handler
  useHandleLeaveQuiz(quizState, setQuizState, navigation, API_BASE_URL);

  if (quizState.setupMode) {
    return (
      <SetupScreen
        styles={quizStyles}
        quizState={quizState}
        setQuizState={setQuizState}
        handleSetupComplete={fetchQuestions}
        subject={subject}
      />
    );
  }

  if (quizState.errorMessage) {
    return (
      <View style={quizStyles.errorContainer}>
        <Text style={quizStyles.errorMessage}>
          {quizState.errorMessage || "There was an error"}
        </Text>
        <TouchableOpacity
          style={quizStyles.retryButton}
          onPress={fetchQuestions}
        >
          <Text style={quizStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quizState.loading) {
    return <Loader text="Loading Question..." loading={quizState.loading} />;
  }

  return (
    <SafeAreaView style={quizStyles.quiz}>
      <View style={quizStyles.header}>
        <Text style={quizStyles.topicTitle}>
          {testType === "complete" ? "QUIZ" : subject}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={quizStyles.scrollView}
      >
        <View style={quizStyles.container}>
          <QuestionBox styles={quizStyles} quizState={quizState} />
          {quizState.showNextButton ? "" : <AnimatedThinkingEmoji />}
          <OptionsList
            styles={quizStyles}
            quizState={quizState}
            validateAnswer={validateAnswer}
          />
          {/* {quizState.showNextButton? (
          <TouchableOpacity style={quizStyles.startButton} onPress={handleNext}>
            <Text style={quizStyles.startButtonText}>Next</Text>
          </TouchableOpacity>
        ):
        <Text style={{fontSize:26, textAlign:'center'}}>🤔</Text>}
         */}
          {quizState.showNextButton && (
            <TouchableOpacity
              style={quizStyles.nextButton}
              onPress={handleNext}
            >
              <Text style={quizStyles.startButtonText}>Next</Text>
            </TouchableOpacity>
          )}

          <ScoreModal
            styles={quizStyles}
            quizState={quizState}
            restartQuiz={restartQuiz}
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Quiz;
