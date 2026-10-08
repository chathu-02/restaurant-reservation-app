import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';

import { AuthProvider } from '@/hooks/useAuth';
import NotificationToast from '@/components/NotificationToast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

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
