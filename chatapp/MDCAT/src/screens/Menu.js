import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext"; // Import useAuth for logout functionality

const { width } = Dimensions.get("window");

const Menu = ({ navigation }) => {
  const { logout } = useAuth(); // Access logout from AuthContext

  const handleOptionPress = (option) => {
    switch (option) {
      case "Profile":
        navigation.navigate("Profile");
        break;
      case "Feedback - Report Issue":
        navigation.navigate("Feedback");
        break;
      case "Bookmarks":
        navigation.navigate("Bookmarks");
        break;
      case "Quiz History": // New case for Quiz History
        navigation.navigate("QuizHistory");
        break;
      case "Share":
        Alert.alert("Share", "Share with your friends!");
        break;
      case "Contact":
        Alert.alert("Contact Us", "Email us at: support@example.com");
        break;
      case "Logout":
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Logout",
              onPress: () => {
                logout(); // Call the logout function
                navigation.reset({
                  index: 0,
                  routes: [{ name: "AuthForm" }], // Reset navigation to AuthForm
                });
              },
            },
          ],
          { cancelable: true }
        );
        break;
      default:
        break;
    }
  };

  const menuOptions = [
    { name: "Profile", icon: "person-outline", color: "#4F8383" },
    {
      name: "Feedback - Report Issue",
      icon: "chatbubble-outline",
      color: "#2F4F4F",
    },
    { name: "Contact Us", icon: "mail-outline", color: "#3498db" },
    {
      name: "Logout",
      icon: "exit-outline",
      color: "#e74c3c",
      showIndicator: true,
    }, // We added a `showIndicator` flag here
  ];

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#c3cfe2"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Options</Text>
      </View>

      {/* Menu Options */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {menuOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuOption}
            onPress={() => handleOptionPress(option.name)}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name={option.icon} size={24} color={option.color} />
            </View>
            <Text style={styles.optionText}>{option.name}</Text>
            <View style={styles.chevronContainer}>
              <MaterialIcons name="chevron-right" size={24} color="#b0b0b0" />
              {option.showIndicator && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}></Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginLeft: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    fontFamily: "Nunito_600SemiBold",
  },
  scrollContainer: { padding: 20 },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#34495e",
    fontWeight: "500",
    fontFamily: "Nunito_400Regular",
  },
  chevronContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -1,
    backgroundColor: "#e74c3c",
    width: 28,
    height: 28,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Nunito_600SemiBold",
  },
});

export default Menu;
