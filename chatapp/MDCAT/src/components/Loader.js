import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";

const Loader = ({ loading, text }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval;

    if (loading) {
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 1) {
            return prevProgress + 0.15;
          }
          clearInterval(progressInterval);
          return 1;
        });
      }, 500);
    } else {
      setProgress(0);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [loading]);

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#c3cfe2"]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F8383" />
        <Text style={styles.loaderText}>{text}...</Text>
        <Progress.Bar
          progress={progress}
          width={200}
          height={6}
          color="#4F8383"
          unfilledColor="#d3d3d3"
          borderWidth={0}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4F8383",
  },
});

export default Loader;
