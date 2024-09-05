import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MenuRecommendScreen from "./screens/MenuRecommendScreen";
import { GlobalStyle } from "./constants/styles";
import Toast, { BaseToast } from "react-native-toast-message";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();
const toastConfig = {
  success: (internalState) => (
    <BaseToast
      {...internalState}
      style={{ borderLeftColor: "green", width: "40%" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 20,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 15,
        color: "gray",
      }}
    />
  ),
  error: (internalState) => (
    <BaseToast
      {...internalState}
      style={{ borderLeftColor: "red", width: "40%" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 20,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 15,
        color: "gray",
      }}
    />
  ),
};

function HomeOverview() {
  return (
    <>
      <StatusBar hidden={true} />
      <BottomTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: GlobalStyle.colors.primaryButton,
          tabBarInactiveTintColor: GlobalStyle.colors.darken30,
          headerStyle: {
            backgroundColor: GlobalStyle.colors.primary,
          },
          headerShown: false,
        }}
      >
        <BottomTabs.Screen
          name="Trang chủ"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <BottomTabs.Screen
          name="Menu thông minh"
          component={CameraScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cafe" size={size} color={color} />
            ),
          }}
        />
        <BottomTabs.Screen
          name="Hồ sơ"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </BottomTabs.Navigator>
    </>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: GlobalStyle.colors.primary,
            },
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="HomeOverview" component={HomeOverview} />
          <Stack.Screen name="MenuRecommend" component={MenuRecommendScreen} />
        </Stack.Navigator>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
