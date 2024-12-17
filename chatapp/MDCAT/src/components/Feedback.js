import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const Feedback = ({ navigation }) => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback before submitting!");
      return;
    }

    // Process feedback submission here (e.g., send to a server or email)
    Alert.alert("Thank you!", "Your feedback has been submitted.");
    setFeedback(""); // Clear the input after submission
  };

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#e6eef3"]}>
      <TouchableOpacity style={{position:'absolute', top: 25, left:15}} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#2F4F4F" />
        </TouchableOpacity>
      <View style={styles.feedbackContainer}>
        <Text style={styles.title}>We value your feedback!</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Write your feedback here..."
          placeholderTextColor="#7f8c8d"
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleFeedbackSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 40,
    marginLeft: 15,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4F8383",
    fontFamily: "Nunito_400Regular",
  },
  feedbackContainer: {
    flex: 0.8,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Nunito_600SemiBold",
  },
  textInput: {
    height: 150,
    borderColor: "#dcdcdc",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 15,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#34495e",
    marginBottom: 20,
    fontFamily: "Nunito_400Regular",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: "#4F8383",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
  },
});

export default Feedback;
