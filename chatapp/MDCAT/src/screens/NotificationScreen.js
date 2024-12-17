import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";

const { width } = Dimensions.get("window");

const NotificationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: "Reminder",
      title: "Quiz Reminder",
      message: "Don't forget to complete your weekly Biology quiz!",
      date: "Nov 20, 2024",
      icon: "notifications",
      unread: true,
    },
    {
      id: 2,
      category: "Update",
      title: "New Subject Added",
      message: "Logical Reasoning is now available. Start exploring today!",
      date: "Nov 19, 2024",
      icon: "flask",
      unread: false,
    },
    {
      id: 3,
      category: "Achievement",
      title: "Performance Update",
      message: "Your Chemistry progress increased by 10%. Keep it up!",
      date: "Nov 18, 2024",
      icon: "trophy",
      unread: false,
    },
    {
      id: 4,
      category: "Reminder",
      title: "Upcoming Test",
      message: "Your Physics test is scheduled for Nov 25. Prepare well!",
      date: "Nov 17, 2024",
      icon: "school",
      unread: true,
    },
  ]);

  useEffect(() => {
    // Simulate loading for demonstration
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader loading={loading} text={"Loading Notifications..."} />;
  }

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#c3cfe2"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#2F4F4F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              notification.unread && styles.unreadCard,
            ]}
            
          >
            <Ionicons
              name={notification.icon}
              size={28}
              color={notification.unread ? "#4F8383" : "#7f8c8d"}
              style={styles.notificationIcon}
            />
            <View style={styles.cardContent}>
              <Text style={styles.notificationCategory}>
                {notification.category}
              </Text>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
            </View>
            {notification.unread && <View style={styles.unreadBadge} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F8383",
    fontFamily: "Nunito_600SemiBold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginLeft: 10,
    fontFamily: "Nunito_600SemiBold",
  },
  scrollContainer: {
    padding: 20,
  },
  notificationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    width: width - 40,
    alignSelf: "center",
  },
  unreadCard: {
    backgroundColor: "#e8f7f2",
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  notificationIcon: {
    paddingRight: 10,
  },
  notificationCategory: {
    fontSize: 12,
    color: "#7f8c8d",
    fontFamily: "Nunito_400Regular",
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F8383",
    alignSelf: "flex-start",
  },
});

export default NotificationScreen;
