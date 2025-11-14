import { LoaderCircle } from "lucide-react-native";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import theme from "@/utils/theme";
import { View } from "react-native";
import BackgroundDecorations from "@/assets/svgs/BackgroundDecorations";
import LogoText from "@/assets/svgs/LogoText";

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
