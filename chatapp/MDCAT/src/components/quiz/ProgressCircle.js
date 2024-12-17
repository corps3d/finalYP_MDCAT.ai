import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const ProgressCircle = ({ progress, styles, count }) => {
  const radius = 40;
  const strokeWidth = 10;
  const strokeDashoffset =
    circumference - Math.min(1, Math.max(0, progress)) * circumference;

  return (
    <View style={styles.progressCircleContainer}>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          stroke="#ecf0f1"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <Circle
          stroke="#2F4F4F"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <Text style={styles.progressText}>{count+1}</Text>
    </View>
  );
};

export default ProgressCircle;
