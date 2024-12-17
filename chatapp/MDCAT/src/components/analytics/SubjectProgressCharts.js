import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 40;

const SubjectProgressCharts = ({ quizHistory }) => {
  const [activeSubject, setActiveSubject] = useState(null);

  const subjectData = useMemo(() => {
    const subjects = {};

    // Process quiz history
    quizHistory.forEach((quiz) => {
      const date = new Date(quiz.createdAt).toLocaleDateString();

      // Group questions by subject
      quiz.questions.forEach(({ question, userAnswer }) => {
        const subject =
          question.subject === "letter and symbol series"
            ? "logical"
            : question.subject;

        if (!subjects[subject]) {
          subjects[subject] = {
            data: {},
            totalQuestions: {},
            color: getSubjectColor(subject),
          };
        }

        if (!subjects[subject].data[date]) {
          subjects[subject].data[date] = 0;
          subjects[subject].totalQuestions[date] = 0;
        }

        subjects[subject].totalQuestions[date]++;
        if (question.correctOption === userAnswer) {
          subjects[subject].data[date]++;
        }
      });
    });

    return formattedData;
  }, [quizHistory]);

  const renderChart = useCallback(({ subject, dates, scores, color }) => {
    if (dates.length === 0) {
      return (
        <View style={styles.noDataCard}>
          <MaterialCommunityIcons name="chart-line" size={40} color="#ccc" />
          <Text style={styles.noDataText}>No data available for {subject}</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: dates,
            datasets: [
              {
                data: scores,
                color: () => color,
                strokeWidth: 2,
              },
            ],
          }}
          width={CHART_WIDTH}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#fff",
            },
            propsForLabels: {
              fontSize: 10,
              rotation: 45,
            },
          }}
          bezier
          style={styles.chart}
          fromZero
          yAxisSuffix="%"
          yAxisInterval={1}
        />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Latest Score</Text>
            <Text style={[styles.statValue, { color }]}>
              {scores[scores.length - 1]?.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color }]}>
              {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    );
  }, []);

  if (!quizHistory || quizHistory.length === 0) {
    return null;
  }

  const activeSubjectData = subjectData.find(
    (data) => data.subject === activeSubject
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Progress Over Time</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {subjectData.map((data) => (
          <TouchableOpacity
            key={data.subject}
            onPress={() => setActiveSubject(data.subject)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeSubject === data.subject ? data.color : "transparent",
                borderColor: data.color,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeSubject === data.subject ? "#fff" : data.color,
                },
              ]}
            >
              {data.subject}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeSubjectData && renderChart(activeSubjectData)}
    </View>
  );
};

const getSubjectColor = (subject) => {
  const colors = {
    biology: "#4ecdc4",
    physics: "#f7d794",
    chemistry: "#ff6b6b",
    logical: "#a8e6cf",
    english: "#dcd6f7",
  };
  return colors[subject] || "#95afc0";
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    marginLeft: 20,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noDataCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});

export default SubjectProgressCharts;
