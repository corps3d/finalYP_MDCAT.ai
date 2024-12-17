import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Markdown from "react-native-markdown-display";
import { FontFamily, FontSize } from "../styles/GlobalStyles";

const MessageBubble = ({ message, isBot, timestamp, username }) => {
  const { width } = useWindowDimensions();

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View
      style={[
        styles.messageWrapper,
        isBot ? styles.botWrapper : styles.userWrapper,
        { maxWidth: width - 40, minWidth: width * 0.3 }, // Full width minus padding
      ]}
    >
      {isBot && (
        <View style={styles.botTile}>
          <Text style={styles.botTileText}>B</Text>
        </View>
      )}

      <Markdown
        style={isBot ? markdownStyles.botText : markdownStyles.userText}
      >
        {message.content}
      </Markdown>

      <Text style={styles.timestamp}>{formattedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    marginVertical: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    position: "relative",
  },
  botWrapper: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F2F5",
    marginLeft: 30,
  },
  userWrapper: {
    alignSelf: "flex-end",
    backgroundColor: "#D1FFE7",
  },
  timestamp: {
    fontSize: 12,
    color: "#B0B3B8",
    marginTop: 2,
    alignSelf: "flex-end",
    fontFamily: "Nunito_400Regular",
  },
  botTile: {
    position: "absolute",
    left: -25,
    top: 4,
    backgroundColor: "#333",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botTileText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Nunito_400Regular",
  },
});

const markdownStyles = {
  botText: {
    body: {
      fontFamily: "Nunito_400Regular",
      fontSize: 14,
      lineHeight: 20,
      color: "#333333",
    },
    heading1: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: 18,
      lineHeight: 28,
      color: "#333333",
      marginBottom: 8,
      fontWeight: "bold",
      backgroundColor: "#F0F2F5",
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    heading2: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: 16,
      lineHeight: 26,
      color: "#333333",
      marginBottom: 6,
      fontWeight: "bold",
      backgroundColor: "#F0F2F5",
      paddingHorizontal: 6,
      borderRadius: 4,
    },
  },
  userText: {
    body: {
      fontFamily: "Nunito_400Regular",
      fontSize: 14,
      lineHeight: 15,
      color: "#1F3A3A",
    },
    heading1: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: 18,
      lineHeight: 28,
      color: "#1F3A3A",
      marginBottom: 8,
      fontWeight: "bold",
      backgroundColor: "#D1FFE7",
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    heading2: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: 16,
      lineHeight: 26,
      color: "#1F3A3A",
      marginBottom: 6,
      fontWeight: "bold",
      backgroundColor: "#D1FFE7",
      paddingHorizontal: 6,
      borderRadius: 4,
    },
  },
};

export default MessageBubble;