import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, [colorScheme]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
      />
    </Stack>
  );
}
