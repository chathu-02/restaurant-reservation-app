import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AuthProvider } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F6F9F8' },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="index" options={{ title: 'Shift Overview' }} />
          <Stack.Screen name="explore" options={{ title: 'Reservations & Tables' }} />
          <Stack.Screen name="queue" options={{ title: 'Queue & Waitlist' }} />
          <Stack.Screen name="profile" options={{ title: 'Staff Profile' }} />
          <Stack.Screen name="login" options={{ title: 'Staff Login' }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
