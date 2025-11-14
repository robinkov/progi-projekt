import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import { useFonts } from "@expo-google-fonts/montserrat";
import fonts from "@/constants/fonts";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [loaderTimeout, setLoaderTimeout] = useState<boolean>(false);
  const [fontsLoaded, fontsError] = useFonts(fonts);

  const router = useRouter();

  const isLoaded = {
    timeout: loaderTimeout,
    fonts: fontsLoaded
  }

  useEffect(() => {
    if (Object.values(isLoaded).every(value => value === true)) {
      //router.replace("/(auth)");
    }
  }, [fontsLoaded, loaderTimeout]);

  // show loader screen for at least 5 seconds
  // i spent too much time making it for it to not be displayed
  useEffect(() => {
    setTimeout(() => {
      setLoaderTimeout(true);
    }, 5000);
  }, []);
  
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </SafeAreaProvider>
  );
}
