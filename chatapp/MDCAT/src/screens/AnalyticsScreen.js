import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import SubjectProgressCharts from "../components/analytics/SubjectProgressCharts";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import axios from "axios";
import client from "../utils/api/client";

const { width } = Dimensions.get("window");

const AnalyticsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [statsResponse, progressResponse, quizHistoryResponse] = await Promise.all([
        axios.get(`http:192.168.0.102:8000/rl/${user._id}/stats`),
        axios.get(`http:192.168.0.102:8000/rl/${user._id}/progress`),
        client.get(`/quiz/${user._id}`),
      ]);

      setStats(statsResponse.data.statistics);
      setProgress(progressResponse.data);
      setQuizHistory(quizHistoryResponse.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalytics();
  }, [fetchAnalytics]);

  const subjectPerformance = useMemo(() => {
    if (!stats) return { labels: [], data: [] };

    const subjects = Object.keys(stats);
    const accuracies = subjects.map((subject) => {
      const difficultyLevels = stats[subject];
      const totalAttempts = Object.values(difficultyLevels).reduce(
        (sum, level) => sum + level.attempts,
        0
      );
      const weightedAccuracy = Object.values(difficultyLevels).reduce(
        (sum, level) => sum + level.accuracy * level.attempts,
        0
      );
      return totalAttempts > 0 ? (weightedAccuracy / totalAttempts) * 100 : 0;
    });

    return {
      labels: subjects.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
      data: accuracies,
    };
  }, [stats]);

  const difficultyDistribution = useMemo(() => {
    if (!progress) return [];

    const totalAttempts = progress.overall_stats.total_attempts;
    const difficulties = ["easy", "medium", "hard"];

    return difficulties.map((difficulty) => {
      const attemptsInDifficulty = Object.values(
        progress.progress_report
      ).reduce((sum, subject) => sum + (subject[difficulty]?.attempts || 0), 0);

      return {
        name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        attempts: attemptsInDifficulty,
        percentage: (attemptsInDifficulty / totalAttempts) * 100,
        color:
          difficulty === "easy"
            ? "#4ecdc4"
            : difficulty === "medium"
            ? "#f7d794"
            : "#ff6b6b",
      };
    });
  }, [progress]);

  const renderPerformanceCard = useCallback(
    ({ title, value, icon, color }) => (
      <View style={[styles.performanceCard, { borderLeftColor: color }]}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[styles.cardValue, { color }]}>{value}</Text>
      </View>
    ),
    []
  );

  if (loading) {
    return <Loader loading={loading} text="Loading Analytics..." />;
  }

  if (!stats || !progress) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.noDataText}>
          No analytics data available. Start practicing to see your progress!
        </Text>
        <TouchableOpacity
          style={styles.startPracticeButton}
          onPress={() => navigation.navigate("Practice")}
        >
          <Text style={styles.startPracticeButtonText}>Start Practice</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={["#f5f7fa", "#e6eef3"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overall Performance Cards */}
        <View style={styles.cardsContainer}>
          {renderPerformanceCard({
            title: "Overall Accuracy",
            value: `${(progress.overall_stats.average_accuracy * 100).toFixed(
              1
            )}%`,
            icon: "analytics",
            color: "#4ecdc4",
          })}
          {renderPerformanceCard({
            title: "Total Questions",
            value: progress.overall_stats.total_attempts,
            icon: "checkbox",
            color: "#f7d794",
          })}
        </View>

        {/* Subject Performance Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
          <BarChart
            data={{
              labels: subjectPerformance.labels,
              datasets: [{ data: subjectPerformance.data }],
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
          />
        </View>

        {/* Mastery Progress */}
        <View style={styles.masteryContainer}>
          <Text style={styles.sectionTitle}>Mastery Progress</Text>
          {Object.entries(progress.progress_report).map(([subject, levels]) => (
            <View key={subject} style={styles.masteryCard}>
              <Text style={styles.masterySubject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </Text>
              <View style={styles.masteryLevels}>
                {Object.entries(levels).map(([level, data]) => (
                  <View key={level} style={styles.masteryLevel}>
                    <Text style={styles.masteryLevelText}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                    <View
                      style={[
                        styles.masteryIndicator,
                        {
                          backgroundColor: data.mastered
                            ? "#4ecdc4"
                            : "#e0e0e0",
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 12,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  startPracticeButton: {
    backgroundColor: "#4ecdc4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  startPracticeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AnalyticsScreen;
