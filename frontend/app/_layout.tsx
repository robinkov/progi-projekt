import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import { useFonts } from "@expo-google-fonts/montserrat";
import fonts from "@/constants/fonts";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts(fonts);

  const isLoaded = {
    fonts: fontsLoaded
  }

  useEffect(() => {
    if (Object.values(isLoaded).every(value => value === true)) {
      console.log("App ready");
    }
  }, [fontsLoaded]);
  
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}
