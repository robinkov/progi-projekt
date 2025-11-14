import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import LogoText from "@/assets/svgs/LogoText";
import theme from "@/utils/theme";
import Button, { TextButton } from "@/components/Button";
import GoogleLogo from "@/assets/svgs/GoogleLogo";
import GitHubLogoCat from "@/assets/svgs/GitHubLogoCat";
import { useRouter } from "expo-router";

export default function index() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require("@/assets/images/header-image.webp")}
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
        <LogoText height={40} fill={theme.colors.foreground} />
        <View style={{
          width: 250,
          paddingTop: 70,
          gap: 40
        }}>
          <View style={{ gap: 10 }}>
            <TextButton
              onPress={() => router.push("/(auth)/login")}
              size="lg"
            >
              Login
            </TextButton>
            <TextButton
              onPress={() => router.push("/(auth)/register")}
              size="lg"
            >
              Register
            </TextButton>
          </View>
          <View style={{ gap: 10 }}>
            <Button style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: theme.colors.muted.DEFAULT
            }}>
              <GoogleLogo height={24} />
            </Button>
            <Button style={{
              backgroundColor: "black",
            }}>
              <View style={{
                flexDirection: "row",
                gap: 8,
                height: 24
              }}>
                <GitHubLogoCat height={24} />
                <View style={{ justifyContent: "center" }}>
                  <Image
                    source={require("@/assets/images/GitHub_Logo_White.png")}
                    style={{
                      height: 16,
                      aspectRatio: 876/239,
                      width: "auto"
                    }}
                  />
                </View>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  )
}
