import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";

const OptionsList = ({
  styles,
  quizState,
  validateAnswer,
}) => {
  const currentQuestion = quizState.question;

  return (
    <ScrollView
      style={styles.optionsContainer}
      contentContainerStyle={styles.optionsContentContainer}
    >
      {currentQuestion?.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionItem,
            quizState.selectedOption === index && styles.selectedOption,
          ]}
          onPress={() => validateAnswer(index)}
        >
          <Text
            style={[
              styles.optionText,
              quizState.selectedOption === index && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default OptionsList;
