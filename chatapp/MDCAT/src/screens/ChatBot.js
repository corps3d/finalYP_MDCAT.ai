import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MessageBubble from "../components/MessageBubble";
import useSocket from "../hooks/useSocket";
import client from "../utils/api/client";

const ChatBot = ({ route, navigation }) => {
  const { chatId } = route.params;
  const [inputText, setInputText] = useState("");
  const [chatName, setChatName] = useState("");
  const flatListRef = useRef(null);
  
  const { 
    sendMessage, 
    isConnected, 
    error, 
    messages, 
    isWaitingForReply, 
    refreshChat 
  } = useSocket(chatId);

  useEffect(() => {
    console.log("ChatID:", chatId)
    fetchChatDetails();
  }, [chatId]);

  const fetchChatDetails = async () => {
    try {
      const response = await client.get(`chat/${chatId}/messages`);
      setChatName(response.data.data.chatName);
    } catch (error) {
      console.log('Failed to fetch chat details');
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || !isConnected || isWaitingForReply) return;
    
    sendMessage(inputText.trim());
    setInputText("");
  };

  const renderMessage = ({ item }) => (
    <MessageBubble message={item} isBot={item.sender === "bot" } timestamp={item.timestamp} username={item.username} />
  );

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} colors={["#2F4F4F", "#4F8383"]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.chatInfo}>
          <Image
            style={styles.profileImage}
            contentFit="cover"
            source={require("../../assets/ellipse-3.png")}
          />
          <Text style={styles.chatName}>{chatName}</Text>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
        refreshing={!isConnected}
        onRefresh={refreshChat}
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <LinearGradient
            style={styles.errorBackground}
            colors={["#FF6B6B", "#FF9B9B"]}
          >
            <Ionicons name="alert-circle" size={32} color="#fff" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.errorRefreshButton}
              onPress={refreshChat}
            >
              <Text style={styles.errorRefreshText}>Refresh</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={24} color="#2F4F4F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9f3',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontFamily: 'Nunito_400Regular',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorBackground: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  errorRefreshButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  errorRefreshText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default ChatBot;
