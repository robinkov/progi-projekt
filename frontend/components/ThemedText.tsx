import { Text, TextProps } from "react-native"
import React from "react"
import theme from "@/utils/theme";

export type ThemedTextProps = TextProps & {
  weight?: keyof typeof theme.fontFamily
};

export default function ThemedText({
  style, weight = "medium", ...rest
}: ThemedTextProps) {
  return <Text
    style={[
      {
        fontFamily: theme.fontFamily[weight],
        color: theme.colors.foreground
      },
      style
    ]}
    { ...rest }
  />;
}
