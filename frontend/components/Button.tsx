import React from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import theme from "@/utils/theme";
import ThemedText, { ThemedTextProps } from "./ThemedText";

const sizeVariants = {
  sm: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  md: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  lg: {
    fontSize: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
};

type ButtonProps = TouchableOpacityProps & {
  size?: keyof typeof sizeVariants
};

export default function Button({
  children, style, size = "md", ...props
}: ButtonProps) {
  const sizeVariant = sizeVariants[size];
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.colors.primary.DEFAULT,
          paddingHorizontal: sizeVariant.paddingHorizontal,
          paddingVertical: sizeVariant.paddingVertical,
          borderRadius: sizeVariant.borderRadius,
          alignItems: "center",
        },
        style
      ]}
      { ...props }
    >
      { children }
    </TouchableOpacity>
  );
}

type TextButtonProps = ButtonProps & {
  weight?: ThemedTextProps["weight"]
};

export function TextButton({
  children,
  style,
  size = "md",
  weight = "medium",
  ...props
}: TextButtonProps) {
  const sizeVariant = sizeVariants[size];
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.colors.primary.DEFAULT,
          paddingHorizontal: sizeVariant.paddingHorizontal,
          paddingVertical: sizeVariant.paddingVertical,
          borderRadius: sizeVariant.borderRadius,
          alignItems: "center",
        },
        style
      ]}
      { ...props }
    >
      <ThemedText weight={weight}
        style={{
          fontSize: sizeVariant.fontSize,
          color: theme.colors.primary.foreground,
        }}
      >
        { children }
      </ThemedText>
    </TouchableOpacity>
  )
}
