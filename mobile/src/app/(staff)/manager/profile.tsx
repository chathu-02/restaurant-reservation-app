import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

export default function StaffProfileScreen() {
  const router = useRouter();
  const { user, logout, toggleDuty, updateService } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/role-choice' as never);
        },
      },
    ]);
  };

  const services = ['BREAKFAST SERVICE', 'LUNCH SERVICE', 'DINNER SERVICE', 'NIGHT SHIFT'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={20} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Staff Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.profileIconCircle}>
              <Text style={styles.profileInitialText}>C</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Sarah Mitchell'}</Text>
              <Text style={styles.userRole}>
                {(user?.role || 'Manager').toUpperCase()} • MANAGER
              </Text>
              <Text style={styles.userEmail}>{user?.email || 'sarah.mitchell@restaurant.com'}</Text>
            </View>
          </View>
        </View>

        {/* Duty Status */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shift & Duty Status</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="clock" size={20} color="#059669" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Active On Duty</Text>
                <Text style={styles.settingSubtext}>
                  {user?.isOnDuty ? 'Currently receiving shift alerts' : 'Currently off duty'}
                </Text>
              </View>
            </View>
            <Switch
              value={user?.isOnDuty ?? true}
              onValueChange={toggleDuty}
              trackColor={{ false: '#CBD5E1', true: '#34D399' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <Text style={[styles.settingLabel, { marginTop: 12, marginBottom: 8 }]}>Select Current Service Shift</Text>
          <View style={styles.serviceChips}>
            {services.map((svc) => {
              const selected = user?.service === svc;
              return (
                <Pressable
                  key={svc}
                  onPress={() => updateService(svc)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {svc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Links</Text>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/(staff)/manager/restaurant-settings' as never)}>
            <View style={styles.settingLeft}>
              <Icon name="gear" size={20} color="#64748B" />
              <Text style={styles.menuText}>Restaurant Settings</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/(staff)/manager/reports' as never)}>
            <View style={styles.settingLeft}>
              <Icon name="chart" size={20} color="#64748B" />
              <Text style={styles.menuText}>Reports & Analytics</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/(staff)/manager/floor-layout' as never)}>
            <View style={styles.settingLeft}>
              <Icon name="grid" size={20} color="#64748B" />
              <Text style={styles.menuText}>Floor Layout</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Logout */}
        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <Button label="Sign Out" variant="secondary" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#009669',
    borderWidth: 2.5,
    borderColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userDetails: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  serviceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipSelected: {
    backgroundColor: '#022C22',
    borderColor: '#022C22',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#34D399',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 12,
  },
});
