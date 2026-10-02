import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.mitchell@restaurant.com');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email) {
      Alert.alert('Required', 'Please enter your staff email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, 'Sarah Mitchell');
      setLoading(false);
      router.replace('/');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F8" />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="utensils" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Restaurant Staff Portal</Text>
          <Text style={styles.subtitle}>Sign in to manage shifts, bookings & waitlist</Text>

          <View style={styles.form}>
            <Input
              label="Staff Email"
              placeholder="name@restaurant.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="person"
            />

            <Input
              label="Pin / Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="gear"
            />

            <Button
              label="Start Shift (Sign In)"
              variant="primary"
              loading={loading}
              onPress={handleLogin}
              style={styles.loginBtn}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F6F9F8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  loginBtn: {
    marginTop: 12,
  },
});
