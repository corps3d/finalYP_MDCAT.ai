import React from "react";
import { View, Text } from "react-native";
import ProgressCircle from "./ProgressCircle";

const QuestionBox = ({ styles, quizState }) => {
  const currentQuestion = quizState.question;
  return (
    <View style={styles.questionBox}>
      <ProgressCircle
        progress={
          (quizState.currentQuestionIndex + 1) / quizState.questionCount
        }
        count={quizState.currentQuestionIndex}
        styles={styles}
      />
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {Math.floor(quizState.timer / 60)}:
          {(quizState.timer % 60).toString().padStart(2, "0")}
        </Text>
      </View>
      <Text style={styles.questionDescription}>
        {currentQuestion?.question}
      </Text>
      <Text
        style={[
          styles.difficultyText,
          currentQuestion?.difficulty === "Easy"
            ? styles.easy
            : currentQuestion?.difficulty === "Medium"
            ? styles.medium
            : styles.hard,
        ]}
      >
        {currentQuestion?.difficulty}
      </Text>
    </View>
  );
};

export default QuestionBox;
