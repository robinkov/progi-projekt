import { View, Text, Platform } from 'react-native'
import React from 'react'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Image, KeyboardAvoidingView } from 'react-native'
import ThemedText from '@/components/ThemedText'
import { ThemedTextInput } from '@/components/Input'
import { TextButton } from '@/components/Button'

export default function register() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ParallaxScrollView
        headerImage={
          <Image
            source={require("@/assets/images/header-image-register.webp")}
            style={{
              width: "100%",
              height: "100%",
              bottom: 0,
              left: 0,
              position: 'absolute',
            }}
          />
        }
      >
        <View style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 60
        }}>
          <ThemedText weight="semibold" style={{ fontSize: 40 }}>
            Register
          </ThemedText>
          <View style={{
            width: 300,
            paddingTop: 70,
            gap: 10,
          }}>
            <ThemedTextInput
              textContentType="givenName"
              placeholder="First Name"
            />
            <ThemedTextInput
              textContentType="familyName"
              placeholder="Last Name"
            />
            <ThemedTextInput
              textContentType="emailAddress"
              placeholder="E-mail"
            />
            <ThemedTextInput
              textContentType="newPassword"
              placeholder="Password"
            />
            <ThemedTextInput
              textContentType="newPassword"
              placeholder="Repeat password"
            />
          </View>
          <View style={{ paddingTop: 40 }}>
            <TextButton>Register</TextButton>
          </View>
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  )
}
