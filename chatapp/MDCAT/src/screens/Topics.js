import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/api/client";
import Loader from "../components/Loader";

const formatSubjectForApi = (subjectName) => subjectName.replace(/\s+/g, "");

const Topics = ({ route }) => {
  const { subject } = route.params || {};
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [completedSubtopics, setCompletedSubtopics] = useState({}); // Track completed subtopics
  const navigation = useNavigation();

  // Generate a unique cache key for each subject
  const cacheKey = `topics_cache_${formatSubjectForApi(subject)}`;

  // Fetch topics from the server
  const fetchTopicsFromServer = async () => {
    try {
      const response = await client.get(
        `subjects/getSubject/${formatSubjectForApi(subject)}`
      );
      const data = response.data.topics;

      // Cache the fetched data
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      return [];
    }
  };

  // Load topics from cache or server
  const loadTopics = async () => {
    try {
      setLoading(true);

      // Try to get cached data
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        setTopicsData(JSON.parse(cachedData));
        setLoading(false);
      }

      // Fetch fresh data from the server and update the cache
      const freshData = await fetchTopicsFromServer();
      if (freshData.length > 0) {
        setTopicsData(freshData);
      }
    } catch (error) {
      console.error("Error loading topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [subject]);

  const toggleExpandTopic = (topicName) => {
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  const handleSubtopicPress = (topic, subtopic) => {
    navigation.navigate("TopicDetails", { subject, topic, subtopic });
  };

  const toggleCompletion = (subtopicName) => {
    setCompletedSubtopics((prev) => ({
      ...prev,
      [subtopicName]: !prev[subtopicName], // Toggle completion status
    }));
  };

  const renderSubtopics = (subtopic, topic) => {
    const isCompleted = completedSubtopics[subtopic.name]; // Check completion status
    return (
      <View style={styles.subtopicCard} key={subtopic.name}>
        <TouchableOpacity
          style={styles.subtopicselement}
          onPress={() => handleSubtopicPress(topic, subtopic.name)}
        >
          <Text style={styles.subtopicText}>{subtopic.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleCompletion(subtopic.name)}>
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "ellipse-outline"} // Display checkmark or empty circle
            size={30}
            color={isCompleted ? "#4F8383" : "#bbb"}
            style={styles.progressCircle}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopicCard = ({ item: topic }) => {
    const isExpanded = expandedTopic === topic.topic_name;
    return (
      <View style={styles.topicCard} key={topic.topic_name}>
        <TouchableOpacity onPress={() => toggleExpandTopic(topic.topic_name)}>
          <View style={styles.topicHeader}>
            <Text style={styles.topicTitle}>{topic.topic_name}</Text>
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#4F8383"
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.subtopicsContainer}>
            {topic.subtopics.map((subtopic) =>
              renderSubtopics(subtopic, topic.topic_name)
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <Loader loading={loading} text={"Loading Topics..."} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Explore Topics in {subject}</Text>
      <FlatList
        data={topicsData}
        renderItem={renderTopicCard}
        keyExtractor={(item) => item.topic_name}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Quiz", { subject: subject })}
      >
        <Ionicons name="school-outline" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  topicCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Nunito_600SemiBold",
  },
  subtopicsContainer: {
    marginTop: 10,
  },
  subtopicselement: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  subtopicCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
  },
  subtopicText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Nunito_400Regular",
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4F8383",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#4F8383",
    fontFamily: "Nunito_400Regular",
  },
});

export default Topics;
