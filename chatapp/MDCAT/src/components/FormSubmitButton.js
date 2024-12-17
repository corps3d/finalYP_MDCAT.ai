import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function FormSubmitButton({ label, onPress, submitting }) {
  const backgroundColor = submitting
    ? "rgba(79, 131, 131, 0.6)"
    : "rgba(47, 79, 79, 1)";
  return (
    <View>
      <TouchableOpacity
        onPress={!submitting ? onPress : null}
        style={[styles.container, { backgroundColor }]}
      >
        <Text style={styles.txt}> {label} </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 18,
    color: "#fff",
  },
  container: {
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
