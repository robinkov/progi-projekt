import type { PropsWithChildren, ReactElement } from 'react';
import { ColorValue, StyleProp, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import theme from '@/utils/theme';

const HEADER_HEIGHT = 250;

type ParallaxScrollViewProps = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor?: ColorValue;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor = theme.colors.background,
}: ParallaxScrollViewProps) {
  const backgroundColor = theme.colors.background;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          { height: HEADER_HEIGHT, overflow: 'hidden', zIndex: 1000 },
          { backgroundColor: headerBackgroundColor },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <View style={{ flex: 1 }}>{children}</View>
    </Animated.ScrollView>
  );
}
