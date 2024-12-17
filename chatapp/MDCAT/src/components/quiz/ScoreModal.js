import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const ScoreModal = ({ styles, quizState, restartQuiz, navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={quizState.showScoreModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.scoreModal}>
          <Text style={styles.modalTitle}>Quiz Completed!</Text>
          <Text style={styles.modalScore}>
            You scored {quizState.score} out of {quizState.questionCount}
          </Text>
          <TouchableOpacity style={styles.resultButton} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Restart Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ScoreModal;
