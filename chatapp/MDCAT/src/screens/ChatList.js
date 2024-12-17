import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useAuth } from "../context/AuthContext";
import client from "../utils/api/client";
import { getAuthData } from "../utils/storage";
import Loader from "../components/Loader";

const ChatList = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [chatToRename, setChatToRename] = useState(null);
  const [newChatName, setNewChatName] = useState("");

  useEffect(() => {
    fetchAuthData();
  }, []);

  const fetchAuthData = async () => {
    const { user } = await getAuthData();
    if (user) {
      setUser(user);
    } else {
      Alert.alert("Error", "User data is unavailable");
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await client.get(`/chat/user/${user._id}`);
      if (response.data.success) {
        setChats(response.data.data);
      } else {
        Alert.alert("Error", response.data.message || "Failed to fetch chats");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await client.post("/chat/create", {
        chatName: `Chat ${chats.length + 1}`,
        userId: user._id,
      });
      if (response.data.success) {
        setChats((prevChats) => [response.data.data, ...prevChats]);
        navigation.navigate("Chat", { chatId: response.data.data._id });
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to create new chat"
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to create new chat. Please try again."
      );
    }
  };

  const renderCreateChatButton = () => (
    <View style={styles.createChatContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={80} color="#4F8383" />
      <Text style={styles.createChatText}>
        Looks like you haven't created any chats yet
      </Text>
      <TouchableOpacity onPress={createNewChat} style={styles.createChatButton}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.createChatButtonText}>Create Your First Chat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderChatList = () => (
    <FlatList
      data={chats}
      renderItem={renderChatItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.chatList}
      refreshing={loading}
      onRefresh={fetchChats}
    />
  );

  const renderChatItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item._id)}>
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate("Chat", { chatId: item._id })}
      >
        <View style={styles.chatActions}>
          <Text style={styles.chatName}>{item.chatName}</Text>
          <TouchableOpacity
            style={styles.renameButton}
            onPress={() => handleRenameChat(item._id, item.chatName)}
          >
            <Ionicons name="pencil" size={16} color="#4F8383" />
          </TouchableOpacity>
        </View>
        <Text style={styles.chatDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderRightActions = (chatId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteChat(chatId)}
    >
      <Ionicons name="trash" size={20} color="#fff" />
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const handleRenameChat = (chatId, currentName) => {
    setChatToRename(chatId);
    setNewChatName(currentName);
    setShowRenameModal(true);
  };

  const handleDeleteChat = (chatId) => {
    if (chats.length === 0) {
      Alert.alert(
        "No Chats to Delete",
        "There are no chats available to delete."
      );
      return; // Prevent deletion if no chats exist
    }

    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteChat(chatId),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAllChats = () => {
    if (chats.length === 0) {
      Alert.alert(
        "No Chats to Delete",
        "There are no chats available to delete."
      );
      return; // Prevent deletion if no chats exist
    }

    Alert.alert(
      "Delete All Chats",
      "Are you sure you want to delete all chats?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: deleteAllChats,
        },
      ],
      { cancelable: true }
    );
  };

  const deleteAllChats = async () => {
    try {
      const response = await client.delete(`/chat/deleteAll/${user._id}`);
      if (response.data.success) {
        setChats([]);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to delete all chats"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete all chats");
    }
  };

  const renameChat = async (chatId, newName) => {
    try {
      const response = await client.patch(`/chat/${chatId}/rename`, {
        chatName: newName,
      });
      if (response.data.success) {
        setShowRenameModal(false);
      } else {
        Alert.alert("Error", response.data.message || "Failed to rename chat");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to rename chat");
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await client.delete(`/chat/${chatId}`);
      if (response.data.success) {
        setChats((prevChats) =>
          prevChats.filter((chat) => chat._id !== chatId)
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to delete chat");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete chat");
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#c3cfe2"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity onPress={handleDeleteAllChats}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loader loading={loading} text={"Loading Chats..."} />
      ) : chats.length === 0 ? (
        renderCreateChatButton()
      ) : (
        renderChatList()
      )}

      <TouchableOpacity onPress={createNewChat} style={styles.newChatButton}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={showRenameModal} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Chat</Text>
            <TextInput
              style={styles.modalInput}
              value={newChatName}
              onChangeText={setNewChatName}
              placeholder="Enter new chat name"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowRenameModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => renameChat(chatToRename, newChatName)}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 10,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    color: "#2c3e50",
    marginLeft: 5,
    fontFamily: "Nunito_600SemiBold",
  },

  newChatButton: {
    position: "absolute",
    bottom: 20, // Position from the bottom
    right: 20, // Position from the right
    backgroundColor: "#4F8383",
    padding: 15,
    borderRadius: 50, // Circular button
    elevation: 5, // Add shadow for elevation on Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  createChatContainer: {
    flex: 1, // Full height of the screen
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    marginTop: 0, // Remove any extra marginTop
    flexDirection: "column", // Stack elements vertically
    textAlign: "center", // Ensure text is centered properly
  },

  createChatText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
    marginBottom: 10,
    marginTop: 20,
  },
  createChatButton: {
    flexDirection: "row",
    backgroundColor: "#4F8383",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  createChatButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontFamily: "Nunito_600SemiBold",
  },
  chatList: {
    padding: 15,
  },
  chatItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  chatActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  renameButton: {
    backgroundColor: "#E0F7FA",
    padding: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderTopRightRadius: 10,
    marginVertical: 6,
    borderBottomRightRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  modalButtonText: {
    color: "#2F4F4F",
    fontFamily: "Nunito_600SemiBold",
  },
});

export default ChatList;
