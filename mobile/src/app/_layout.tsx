import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';

import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/hooks/useAuth';
import NotificationToast from '@/components/NotificationToast';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1 }}>
            <NotificationToast />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F4F9EC' },
                animation: 'slide_from_right',
              }}>
              <Stack.Screen name="index" options={{ title: 'Shift Overview' }} />
              <Stack.Screen name="explore" options={{ title: 'Reservations' }} />
              <Stack.Screen name="reservations" options={{ title: 'Reservations' }} />
              <Stack.Screen name="reservation-detail" options={{ title: 'Reservation Details' }} />
              <Stack.Screen name="queue" options={{ title: 'Queue & Waitlist' }} />
              <Stack.Screen name="add-walkin" options={{ title: 'Add Walk-in Party' }} />
              <Stack.Screen name="tables" options={{ title: 'Tables Management' }} />
              <Stack.Screen name="alerts" options={{ title: 'Alerts & Notifications' }} />
              <Stack.Screen name="restaurant-settings" options={{ title: 'Restaurant Settings' }} />
              <Stack.Screen name="reports" options={{ title: 'Reports & Analytics' }} />
              <Stack.Screen name="profile" options={{ title: 'Staff Profile' }} />
              <Stack.Screen name="login" options={{ title: 'Staff Login' }} />
            </Stack>
          </View>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

