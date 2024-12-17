import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTab";
import TopicDetails from "../screens/TopicDetails";
import Topics from "../screens/Topics";
import Quiz from "../screens/Quiz";
import QuizHistory from "../screens/QuizHistory";
import AuthForm from "../screens/AuthForm";
import ChatList from "../screens/ChatList";
import ChatBot from "../screens/ChatBot";
import { useAuth } from "../context/AuthContext";
import NotificationScreen from "../screens/NotificationScreen";
import Menu from "../screens/Menu";
import Profile from "../screens/Profile";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import Feedback from "../components/Feedback";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token } = useAuth();

  return (
    <Stack.Navigator>
      {/* Auth Screen */}
      {!token && (
        <Stack.Screen
          name="AuthForm"
          component={AuthForm}
          options={{ headerShown: false }}
        />
      )}

      {/* Main Bottom Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Quiz"
        component={Quiz}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Topics"
        component={Topics}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopicDetails"
        component={TopicDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizHistory"
        component={QuizHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatBot}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
