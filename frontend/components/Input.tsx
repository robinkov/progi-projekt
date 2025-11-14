import theme from "@/utils/theme"
import React, { useState } from "react"
import { TextInput, TextInputProps } from "react-native"

type ThemedTextInputProps = TextInputProps;

export function ThemedTextInput({
  style, ...props
}: ThemedTextInputProps) {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        {
          height: 40,
          borderWidth: 1,
          borderColor: focused ? theme.colors.secondary.DEFAULT : theme.colors.border,
          borderRadius: 8,
          fontSize: 16,
          paddingHorizontal: 12,
          backgroundColor: focused ? "white" : theme.colors.background,
        },
        style
      ]}
      { ...props }
    />
  )
}