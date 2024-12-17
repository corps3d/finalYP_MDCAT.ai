import { StyleSheet, Text, View, Animated } from "react-native";
import React from "react";

export default function FormHeader({
  leftHeading,
  rightHeading,
  subHeading,
  lhTranslateX,
  rhTranslateY,
  rhOpacity,
}) {
  return (
    <>
      <View style={styles.container}>
        <Animated.Text
          style={[styles.h1, { transform: [{ translateX: lhTranslateX }] }]}
        >
          {leftHeading}{" "}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.h1,
            { opacity: rhOpacity, transform: [{ translateY: rhTranslateY }] },
          ]}
        >
          {rightHeading}
        </Animated.Text>
      </View>
      <Text style={styles.h2}>{subHeading}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgba(47, 79, 79, 1)",
  },
  h2: {
    fontSize: 18,
    color: "rgba(47, 79, 79, 1)",
    textAlign: "center",
  },
});
