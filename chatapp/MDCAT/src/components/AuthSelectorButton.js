import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from "react-native";
import React from "react";

const AuthSelectorButton = ({ title, style, backgroundColor, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.btn, style, { backgroundColor }]}>
        <Text
          style={{
            color: "white",
            fontSize: 16,
          }}
        >
          {title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 45,
    width: "50%",
    backgroundColor: "rgba(79, 131, 131, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthSelectorButton;
