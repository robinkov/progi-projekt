import { View, Text, Platform } from 'react-native'
import React from 'react'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Image, KeyboardAvoidingView } from 'react-native'
import ThemedText from '@/components/ThemedText'
import { ThemedTextInput } from '@/components/Input'
import { TextButton } from '@/components/Button'

export default function login() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ParallaxScrollView
        headerImage={
          <Image
            source={require("@/assets/images/header-image-login.webp")}
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
            Login
          </ThemedText>
          <View style={{
            width: 300,
            paddingTop: 70,
            gap: 10,
          }}>
            <ThemedTextInput
              textContentType="emailAddress"
              placeholder="E-mail"
            />
            <ThemedTextInput
              textContentType="password"
              placeholder="Password"
            />
          </View>
          <View style={{ paddingTop: 40 }}>
            <TextButton>Login</TextButton>
          </View>
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  )
}
