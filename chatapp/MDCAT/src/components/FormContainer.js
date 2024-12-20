import { KeyboardAvoidingView, StyleSheet, Text, Platform, Dimensions } from "react-native";
import React from "react";

export default function FormContainer({ children }) {
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS == "ios" ? "padding" : null}
      style={styles.container}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: Dimensions.get("window").width,
  },
});
