import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Markdown from "react-native-markdown-display";
import { useAuth } from "../context/AuthContext";
import client from "../utils/api/client";
import { Swipeable } from "react-native-gesture-handler";
import Loader from "../components/Loader";

const { width, height } = Dimensions.get("window");

const QuizHistory = ({ navigation }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await client.get(`/quiz/${user._id}`);
      setQuizzes(response.data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // This function handles pull-to-refresh
  const onRefresh = async () => {
    setLoading(true);
    await fetchQuizzes();
  };

  const fetchFeedback = async (quizId) => {
    try {
      setLoading(true);
      const response = await client.post(`/quiz/feedback`, { quizId });
      setFeedbackText(response.data.feedback || "No feedback available.");
      setSelectedQuizId(quizId);
      setFeedbackVisible(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedbackText("Failed to load feedback. Please try again later.");
      setFeedbackVisible(true);
      setLoading(false);
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (quizzes.length === 0) {
      Alert.alert(
        "No Quiz to Delete",
        "There are no quizzes available to delete."
      );
      return; // Prevent deletion if no quizzes exist
    }

    Alert.alert(
      "Delete Quiz",
      "Are you sure you want to delete this quiz?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteQuiz(quizId),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteQuiz = async (quizId) => {
    try {
      const response = await client.delete(`/quiz/${quizId}`);
      if (response.data.success) {
        setLoading(true);
        await fetchQuizzes(); // Auto-refresh the quiz list
        Alert.alert("Success", "Quiz deleted successfully.");
      } else {
        Alert.alert("Error", response.data.message || "Failed to delete quiz.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete quiz.");
    }
  };

  const renderOption = (option, index) => {
    let backgroundColor = "#f5f5f5";

    return (
      <View key={index} style={[styles.optionContainer, { backgroundColor }]}>
        <Text style={styles.optionText}>{option}</Text>
      </View>
    );
  };

  const renderQuestion = (question) => (
    <View key={question._id} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.question.question}</Text>
      {question.question.options.map((option, index) =>
        renderOption(
          option,
          index,
          question.question.correctOption,
          question.userAnswer
        )
      )}
    </View>
  );

  const renderQuiz = ({ item, index }) => (
    <Swipeable renderRightActions={() => renderRightActions(item._id)}>
      <View key={item._id} style={styles.quizContainer}>
        <TouchableOpacity
          onPress={() => {
            item.expanded = !item.expanded;
            setQuizzes([...quizzes]);
          }}
          style={styles.quizHeader}
        >
          <Ionicons name="book-outline" size={28} color="#2ecc71" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.quizTitle}>Quiz {index + 1}</Text>
            <Text style={styles.quizScore}>Score: {item.Score}</Text>
          </View>
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => fetchFeedback(item._id)}
          >
            <Text style={styles.feedbackText}>View Feedback</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {item.expanded && (
          <View style={styles.questionsContainer}>
            {item.questions.map((question) => renderQuestion(question))}
          </View>
        )}
      </View>
    </Swipeable>
  );

  const renderRightActions = (quizId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteQuiz(quizId)}
    >
      <Ionicons name="trash" size={20} color="#fff" />
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loader loading={loading} text={"Loading Quizzes..."} />;
  }

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#e6eef3"]}>
      <TouchableOpacity
        style={{ position: "absolute", top: 25, left: 15 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#2F4F4F" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Ionicons name="trophy-outline" size={64} color="#4F8383" />
        <Text style={styles.screenTitle}>Quiz History</Text>
      </View>
      {quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          renderItem={renderQuiz}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.quizList}
          refreshing={loading} // Show the loader while refreshing
          onRefresh={onRefresh} // Trigger refresh when pulled
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyMessage}>
            No quizzes found yet. Start your journey today!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Quiz", { subject: null })}
            style={styles.startQuizButton}
          >
            <Text style={styles.startQuizButtonText}>Start a Quiz</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackVisible}
        onRequestClose={() => setFeedbackVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Quiz Feedback</Text>
            <ScrollView style={styles.modalContent}>
              <Markdown style={styles.modalText}>{feedbackText}</Markdown>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFeedbackVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  quizList: {
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 20,
    fontFamily: "Nunito_400Regular",
  },
  startQuizButton: {
    backgroundColor: "#4F8383",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
  },
  startQuizButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    margin: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Nunito_600SemiBold",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  loadingText: {
    color: "#4F8383",
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    fontFamily: "Nunito_600SemiBold",
  },
  quizContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    margin: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    fontFamily: "Nunito_600SemiBold",
  },
  quizScore: {
    fontSize: 14,
    color: "#7f8c8d",
    fontFamily: "Nunito_400Regular",
  },
  feedbackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#4F8383",
    borderRadius: 20,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  optionContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Nunito_600SemiBold",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
  },
  closeButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
  },
});

export default QuizHistory;
