import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";

const SetupScreen = ({
  styles,
  quizState,
  setQuizState,
  handleSetupComplete,
  subject,
}) => {
  const subjectText = subject
    ? `${subject}`
    : "All Subjects";

  const handleSelection = (num) => {
    setQuizState((prev) => ({
      ...prev,
      questionCount: num,
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.setupScrollView, { flex: 1 }]}
        contentContainerStyle={[
          styles.setupScrollViewContent,
          { flexGrow: 0 } 
        ]}
        bounces={false}
        showsVerticalScrollIndicator={true}
      >
        <View style={[styles.setupContainer, { minHeight: '100%' }]}>
          {/* Header Section with Gradient */}
          <LinearGradient
            colors={["#f5f7fa", "#e6eef3"]}
            style={styles.instructionHeader}
          >
            <Ionicons name="school-outline" size={74} color="#4F8383" />
            <Text style={styles.instructionTitle}>Quiz Instructions</Text>

            <View style={styles.subjectInfo}>
              <Text style={{ fontSize: 18, color: "#4F8383", fontWeight: "600" }}>
                This quiz contains questions from:
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: subject ? "#3498db" : "#8e44ad",
                  fontWeight: "bold",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                {subjectText}
              </Text>
            </View>
          </LinearGradient>

          {/* Instruction Section */}
          <View style={styles.instructions}>
            <Markdown style={styles.instructionText}>
              📌 **Each question is timed**: You have 60 seconds to answer each
              question.
            </Markdown>
            <Markdown style={styles.instructionText}>
              📌 **Scoring**: Answer correctly to earn points. No penalty for
              wrong answers.
            </Markdown>
            <Markdown style={styles.instructionText}>
              📌 **Difficulty Adjustment**: Questions will adapt based on your
              performance.
            </Markdown>
            <Markdown style={styles.instructionText}>
              {`📌 **Completion**: The quiz ends after **"${quizState.questionCount}"** questions.`}
            </Markdown>
            <Markdown style={styles.instructionText}>
              {`📌 **Subjects Covered**: ${subjectText}`}
            </Markdown>
          </View>

          {/* Question Count Selection */}
          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>Choose Number of Questions</Text>
            <View style={styles.setupOptions}>
              {[5, 10, 15, 20].map((item) => (
                <TouchableOpacity
                  key={item.toString()}
                  style={[
                    styles.setupOption,
                    quizState.questionCount === item && styles.selectedOption,
                  ]}
                  onPress={() => handleSelection(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={[styles.startButton]}
            onPress={handleSetupComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SetupScreen;