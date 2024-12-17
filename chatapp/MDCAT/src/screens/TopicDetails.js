import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import client from "../utils/api/client";
import Loader from "../components/Loader";

const { height } = Dimensions.get("window");

// Function to format subject names for API usage
const formatSubjectForApi = (subjectName) => subjectName.replace(/\s+/g, "");

const TopicDetails = ({ route }) => {
  const navigation = useNavigation();
  const { subject, topic, subtopic } = route.params;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const scrollViewRef = useRef();

  const generateCacheKey = (subject, topic, subtopic) => {
    const formattedSubject = formatSubjectForApi(subject);
    const encodedTopic = encodeURIComponent(topic);
    const encodedSubtopic = encodeURIComponent(subtopic);

    return `content_cache_${formattedSubject}_${encodedTopic}_${encodedSubtopic}`;
  };

  const fetchContentFromServer = async () => {
    try {
      const formattedSubject = formatSubjectForApi(subject);
      const encodedTopic = encodeURIComponent(topic);
      const encodedSubtopic = encodeURIComponent(subtopic);

      const response = await client.get(
        `subjects/getSubject/${formattedSubject}/topic/${encodedTopic}/subtopic/${encodedSubtopic}`
      );
      const data = response.data.content;

      const cacheKey = generateCacheKey(subject, topic, subtopic);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));

      return data;
    } catch (error) {
      console.error("Error fetching content:", error);
      return "";
    }
  };

  // Function to load content (from cache or server)
  const loadContent = async () => {
    try {
      setLoading(true);
      const cacheKey = generateCacheKey(subject, topic, subtopic);

      // Check if content is already cached
      const cachedContent = await AsyncStorage.getItem(cacheKey);
      if (cachedContent) {
        setContent(JSON.parse(cachedContent));
        setLoading(false);
      } else {
        // If not cached, fetch from server
        const freshContent = await fetchContentFromServer();
        setContent(freshContent);
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [subject, topic, subtopic]);

  // Handle scroll progress
  const handleScroll = (event) => {
    const { contentOffset, contentSize } = event.nativeEvent;
    const currentProgress = contentOffset.y / (contentSize.height - height);
    setProgress(currentProgress);
  };

  const handleTestYourself = () => {
    navigation.navigate("Chatbot");
  };

  if (loading) {
    return <Loader loading={loading} text={"Loading Subtopics..."} />;
  }

  return (
    <LinearGradient style={styles.container} colors={["#fef9f3", "#ecf0f1"]}>
      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.topicTitle}>{subtopic}</Text>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </ScrollView>

      {/* Floating Action Button for "Test Yourself" */}
      <LinearGradient colors={["#4F8383", "#2F4F4F"]} style={styles.fab}>
        <TouchableOpacity onPress={handleTestYourself}>
          <Ionicons name="help-circle-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Progress Bar */}
      <Progress.Bar
        progress={progress}
        width={null}
        height={6}
        color="#4F8383"
        unfilledColor="#d3d3d3"
        borderWidth={0}
        style={styles.progressBar}
      />
    </LinearGradient>
  );
};

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: height * 0.02,
    lineHeight: height * 0.03,
    color: "#333",
    fontFamily: "Nunito_400Regular",
  },
  heading1: {
    fontSize: height * 0.035,
    color: "#4F8383",
    marginVertical: 10,
    fontFamily: "Nunito_600SemiBold",
  },
  heading2: {
    fontSize: height * 0.03,
    fontWeight: "600",
    color: "#4F8383",
    marginVertical: 8,
    fontFamily: "Nunito_600SemiBold",
  },
  paragraph: {
    fontSize: height * 0.02,
    color: "#333",
    marginBottom: 12,
    fontFamily: "Nunito_400Regular",
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  topicTitle: {
    fontSize: height * 0.05,
    color: "#4F8383",
    padding: 20,
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    marginBottom: 10,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Nunito_600SemiBold",
  },
});

export default TopicDetails;
