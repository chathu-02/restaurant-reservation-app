import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/hooks/useAuth';
import NotificationToast from '@/components/NotificationToast';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1 }}>
            <NotificationToast />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F6F9F8' },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(staff)" />
              <Stack.Screen name="(customer)" />
              <Stack.Screen name="(auth)" />

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
          </View>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
