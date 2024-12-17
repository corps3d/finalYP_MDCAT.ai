import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Home from "../screens/Home";
import Quiz from "../screens/Quiz";
import ChatList from "../screens/ChatList";
import Profile from "../screens/Profile";
import Menu from "../screens/Menu";
import AnalyticsScreen from "../screens/AnalyticsScreen"; // Import the Analytics Screen

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home-sharp" : "home-outline"; // Home icon
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Quiz") {
            iconName = focused ? "school" : "school-outline"; // Quiz icon
            size = focused ? size + 6 : size;
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Chatbot") {
            iconName = focused ? "robot" : "robot-outline"; // Chatbot icon
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Analytics") {
            iconName = focused ? "analytics" : "analytics-outline"; // Analytics icon
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Profile") {
            iconName = focused ? "user" : "user-alt"; // Profile icon
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          } else if (route.name === "Menu") {
            iconName = focused ? "grid" : "grid-outline"; // Menu icon
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#2F4F4F",
        tabBarInactiveTintColor: "#7F8C8D",
        tabBarStyle: {
          backgroundColor: "#F1F2F6",
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.6,
          shadowRadius: 20,
          height: 70,
          borderRadius: 15,
          marginBottom: 10,
          elevation: 13,
        },
        tabBarItemStyle: {
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Quiz"
        component={Quiz}
        initialParams={{ testType: "complete" }}
      />
      <Tab.Screen name="Chatbot" component={ChatList} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Menu" component={Menu} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
