import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F6F9F8' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />

        {/* Customer Screens */}
        <Stack.Screen name="join-queue" />
        <Stack.Screen name="queue" />
        <Stack.Screen name="alerts" />
        <Stack.Screen name="customer-profile" />

        {/* Staff Screens */}
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="staff-accounts" />
        <Stack.Screen name="staff-profile" />
      </Stack>
    </SafeAreaProvider>
  );
}
