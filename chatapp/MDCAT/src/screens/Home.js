import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
const { width, height } = Dimensions.get("window"); // Get screen dimensions

const Home = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#c3cfe2"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {`Hello, ${user && user.fullName ? user.fullName : "User"} 👋`}
          </Text>
          <Text style={styles.subGreeting}>Let's start learning today!</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons
            name="notifications-outline"
            size={32}
            color="#2F4F4F"
            style={styles.icon}
            onPress={() => navigation.navigate("Notifications")} // Navigate to Notifications screen
          />
          <Ionicons
            name="person-circle-outline"
            size={32}
            color="#2F4F4F"
            style={styles.icon}
            onPress={() => navigation.navigate("Profile")} // Navigate to Profile screen
          />
        </View>
      </View>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={require("../../assets/doctor.png")} // Placeholder image
          style={styles.heroImage}
        />
        <Text style={styles.heroText}>Ace Your Exams with Confidence!</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Quiz")}
        >
          <Text style={styles.buttonText}>Start Your Quiz</Text>
        </TouchableOpacity>
      </View>
      {/* Subject Cards */}
      <Text style={styles.sectionTitle}>Subjects</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subjectScroll}
      >
        {subjects.map((subject, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subjectCard}
            onPress={() =>
              navigation.navigate("Topics", { subject: subject.name })
            }
          >
            <Ionicons name={subject.icon} size={28} color="#fff" />
            <Text style={styles.subjectText}>{subject.name}</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${subject.progress}%` }]}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Footer with Call to Action */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Upcoming Test: Nov 20th</Text>
        <Text style={styles.footerSubtitle}>
          John Doe scored 95% last time. You could be next!
        </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 3,
    shadowRadius: 6,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    fontFamily: "Nunito_400Regular",
  },
  subGreeting: { fontSize: 14, color: "#7f8c8d", fontFamily: "Nunito_400Regular" },
  hero: { alignItems: "center", marginVertical: 20 },
  heroText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
  },
  heroImage: { width: 100, height: 100, resizeMode: "contain" },
  ctaButton: {
    backgroundColor: "#4F8383",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 15,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15, // Add spacing between the icons
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 20,
    color: "#2c3e50",
    fontFamily: "Nunito_600SemiBold",
  },
  subjectScroll: { paddingVertical: 15, marginTop: 10 },
  subjectCard: {
    backgroundColor: "#4F8383",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    alignItems: "center",
    width: width * 0.3, // Make the card width responsive based on screen size
    height: '100%',
    justifyContent: "space-between",
  },
  subjectText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
  },
  progressBarContainer: {
    width: "100%",
    height: 5,
    backgroundColor: "#ddd",
    marginTop: 10,
  },
  progressBar: { height: "100%", backgroundColor: "#2ecc71" },
  footer: {
    backgroundColor: "#eef2f3",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  footerTitle: { fontSize: 18, fontFamily: "Nunito_600SemiBold" },
  footerSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
    fontFamily: "Nunito_400Regular",
  },
});

export default Home;
