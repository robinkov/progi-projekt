import { SafeAreaView } from "react-native-safe-area-context";
import { LoaderCircle } from "lucide-react-native";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import theme from "@/utils/theme";
import Logo from "@/components/Logo";
import { Platform, View } from "react-native";

export default function Index() {
  const rotate = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + "deg" }]
  }));

  useEffect(() => {
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
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.colors.background
    }}>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <View style={{
          flex: 1,
          aspectRatio: Platform.OS === "web" ? 3.44 : 0.92,
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}>
          <Logo.BackgroundDecorations/>
        </View>
        <View style={{ alignItems: "center", gap: 20, flex: Platform.OS === "web" ? undefined : 1/2 }}>
          <Logo.TextVectorized style={{ height: 50, width: 200 }} />
          <Animated.View style={[animatedStyle, { width: 50 }]}>
            <LoaderCircle
              size={50}
              strokeWidth={3}
              color={theme.colors.primary.DEFAULT}
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}
