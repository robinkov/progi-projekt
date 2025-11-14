import { View, Text, Platform } from "react-native"
import React, { useEffect } from "react"
import ParallaxScrollView from "@/components/ParallaxScrollView"
import { Image, KeyboardAvoidingView } from "react-native"
import ThemedText from "@/components/ThemedText"
import { ThemedTextInput } from "@/components/Input"
import { TextButton } from "@/components/Button"
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { LoaderCircle } from "lucide-react-native"
import theme from "@/utils/theme"
import BackgroundDecorations from "@/assets/svgs/BackgroundDecorations"
import { useAuth } from "@/hooks/use-auth"

export default function register() {
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const rotate = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + "deg" }]
  }));

  const auth = useAuth();

  async function handleRegister() {
    setLoading(true);
    try {
      await auth.registerUserWithEmailAndPassword({
        firstName, lastName, email, password, repeatPassword
      });
      setError(null);
    } catch(error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

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
              position: "absolute",
            }}
          />
        }
      >
        <BackgroundDecorations style={{ width: "100%", position: "absolute", bottom: 0 }} />
        <View style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 60
        }}>
          <ThemedText weight="semibold" style={{ fontSize: 40 }}>
            Register
          </ThemedText>
          { loading ?
            <View style={{ paddingTop: 70 }}>
              <Animated.View style={[animatedStyle, { width: 50 }]}>
                <LoaderCircle
                  size={50}
                  strokeWidth={3}
                  color={theme.colors.primary.DEFAULT}
                />
              </Animated.View>
            </View>
          :
            <View>
              <View style={{
                width: 300,
                paddingTop: 70,
                gap: 10,
              }}>
                { error &&
                  <ThemedText style={{ textAlign: "center", color: theme.colors.destructive.DEFAULT }}>
                    { error }
                  </ThemedText>
                }
                <ThemedTextInput
                  textContentType="givenName"
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <ThemedTextInput
                  textContentType="familyName"
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <ThemedTextInput
                  textContentType="emailAddress"
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                />
                <ThemedTextInput
                  secureTextEntry={true}
                  textContentType="newPassword"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
                <ThemedTextInput
                  secureTextEntry={true}
                  textContentType="newPassword"
                  placeholder="Repeat password"
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                />
              </View>
              <View style={{ paddingTop: 40 }}>
                <TextButton onPress={handleRegister}>Register</TextButton>
              </View>
            </View>
          }
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  )
}
