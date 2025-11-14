import { LoaderCircle } from "lucide-react-native";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";
import theme from "@/utils/theme";
import { View } from "react-native";
import BackgroundDecorations from "@/assets/svgs/BackgroundDecorations";
import LogoText from "@/assets/svgs/LogoText";
import { useFonts } from "@expo-google-fonts/montserrat";
import fonts from "@/constants/fonts";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const [loaderTimeout, setLoaderTimeout] = useState<boolean>(false);
  const [fontsLoaded, fontsError] = useFonts(fonts);

  const router = useRouter();
  const auth = useAuth();

  const rotate = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + "deg" }]
  }));

  const isLoaded = {
    timeout: loaderTimeout,
    fonts: fontsLoaded,
    authenticated: auth.status !== "loading"
  }

  useEffect(() => {
    if (Object.values(isLoaded).every(value => value === true)) {
      router.replace("/(auth)");
    }
  }, [fontsLoaded, loaderTimeout]);

  // show loader screen for at least 5 seconds
  // i spent too much time making it for it to not be displayed
  useEffect(() => {
    setTimeout(() => {
      setLoaderTimeout(true);
    }, 5000);
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear
      }),
      -1
    );

    return () => cancelAnimation(rotate);
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <BackgroundDecorations style={{ width: "100%", position: "absolute", bottom: 0 }} />
      <View style={{ alignItems: "center", gap: 28, flex: 1/2 }}>
        <LogoText style={{ height: 50 }} fill={theme.colors.foreground} />
        <Animated.View style={[animatedStyle, { width: 50 }]}>
          <LoaderCircle
            size={50}
            strokeWidth={3}
            color={theme.colors.primary.DEFAULT}
          />
        </Animated.View>
      </View>
    </View>
  );
}
