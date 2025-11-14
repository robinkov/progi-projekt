import { useAuth } from "@/hooks/use-auth";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function _layout() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status !== "authenticated") {
      router.replace("/(auth)");
    }
  }, [auth.status]);
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
