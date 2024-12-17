import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuthData } from "../utils/storage";
import Loader from "../components/Loader";

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const { user } = await getAuthData();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching auth data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, []);

  if (loading) {
    return <Loader loading={loading} text={"Loading Profile..."} />;
  }

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#e6eef3"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#2F4F4F" />
        </TouchableOpacity>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={userDetails.profilePicture}
            style={styles.profilePicture}
          />
          <Text style={styles.name}>{userDetails.name}</Text>
          <Text style={styles.email}>{userDetails.email}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart-outline" size={24} color="#3498db" />
            <Text style={styles.cardTitle}>Course Progress</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${userDetails.progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {userDetails.progress}% completed
          </Text>
        </View>

        {/* Quizzes Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={24} color="#2ecc71" />
            <Text style={styles.cardTitle}>Quiz History</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("QuizHistory")}
          >
            <Text style={styles.buttonText}>View Quizzes</Text>
          </TouchableOpacity>
        </View>

        {/* Resources Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="library-outline" size={24} color="#e67e22" />
            <Text style={styles.cardTitle}>Resources</Text>
          </View>
          <TouchableOpacity style={styles.resourceButton}>
            <Ionicons name="document-text-outline" size={20} color="#2c3e50" />
            <Text style={styles.resourceText}>Study Materials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceButton}>
            <Ionicons name="videocam-outline" size={20} color="#2c3e50" />
            <Text style={styles.resourceText}>Video Lectures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceButton}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#2c3e50"
            />
            <Text style={styles.resourceText}>Discussion Forums</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
    fontFamily: "Nunito_600SemiBold",
  },
  email: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Nunito_400Regular",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
    fontFamily: "Nunito_600SemiBold",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: { height: "100%", backgroundColor: "#4CAF50" },
  progressText: {
    textAlign: "right",
    fontWeight: "600",
    color: "#2c3e50",
    fontFamily: "Nunito_600SemiBold",
  },
  button: {
    backgroundColor: "#4F8383",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
  },
  resourceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resourceText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
    fontFamily: "Nunito_400Regular",
  },
});

export default Profile;
