import React, { useEffect } from 'react'
import { router, Stack, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function _layout() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "authenticated") {
      router.replace("/(tabs)");
    }
  }, [auth.status]);


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
