import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
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
