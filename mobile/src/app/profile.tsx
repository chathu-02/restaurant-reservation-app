import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, toggleDuty, updateService, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end your shift and sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F8" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={20} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Staff Profile & Shift</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* User Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('@/assets/images/staff_avatar.jpg')}
                style={styles.avatar}
              />
              <View
                style={[
                  styles.onlineBadge,
                  { backgroundColor: user?.isOnDuty ? '#10B981' : '#9CA3AF' },
                ]}
              />
            </View>

            <Text style={styles.userName}>{user?.name || 'Sarah Mitchell'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'sarah.mitchell@restaurant.com'}</Text>

            <View style={styles.badgesRow}>
              <StatusBadge
                label={user?.isOnDuty ? 'Shift Lead on Duty' : 'Off Duty'}
                variant={user?.isOnDuty ? 'green' : 'gray'}
                dot
              />
              <StatusBadge
                label={user?.service || 'DINNER SERVICE'}
                variant="green"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>SHIFT CONTROLS</Text>
            <View style={styles.optionsCard}>
              <Pressable
                onPress={() => {
                  toggleDuty();
                  Alert.alert(
                    'Duty Status Changed',
                    user?.isOnDuty ? 'You are now marked OFF DUTY' : 'You are now marked ON DUTY'
                  );
                }}
                style={styles.optionRow}>
                <View style={[styles.optionIcon, { backgroundColor: '#E6F8F0' }]}>
                  <Icon name="check" size={18} color="#009669" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Toggle Duty Status</Text>
                  <Text style={styles.optionSub}>
                    Current: {user?.isOnDuty ? 'Active on Floor' : 'Off Duty'}
                  </Text>
                </View>
                <Icon name="chevron-right" size={16} color="#9CA3AF" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                onPress={() => {
                  const nextService =
                    user?.service === 'DINNER SERVICE' ? 'LUNCH SERVICE' : 'DINNER SERVICE';
                  updateService(nextService);
                  Alert.alert('Service Switched', `Switched to ${nextService}`);
                }}
                style={styles.optionRow}>
                <View style={[styles.optionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Icon name="clock" size={18} color="#D97706" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Switch Meal Service</Text>
                  <Text style={styles.optionSub}>{user?.service || 'DINNER SERVICE'}</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          {/* Manager Tools */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ADMIN & TOOLS</Text>
            <View style={styles.optionsCard}>
              <Pressable
                onPress={() => router.push('/explore')}
                style={styles.optionRow}>
                <View style={[styles.optionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Icon name="table" size={18} color="#2563EB" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Floor Plan & Table Setup</Text>
                  <Text style={styles.optionSub}>20 tables • 3 dining sections</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#9CA3AF" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                onPress={() =>
                  Alert.alert(
                    'Kitchen Pacing',
                    'Interval: 15 min\nMax covers per slot: 24\nCurrent load: 70%'
                  )
                }
                style={styles.optionRow}>
                <View style={[styles.optionIcon, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="gear" size={18} color="#4F46E5" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Kitchen Pacing & Rules</Text>
                  <Text style={styles.optionSub}>Auto-throttle pacing rules</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          {/* Sign Out Button */}
          <Button
            label="Sign Out of Shift"
            variant="white"
            textStyle={{ color: '#EF4444' }}
            onPress={handleLogout}
            style={styles.logoutBtn}
          />
        </ScrollView>
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
    backgroundColor: '#F6F9F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F0',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#009669',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
    marginLeft: 4,
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  optionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 62,
    marginRight: 14,
  },
  logoutBtn: {
    marginTop: 8,
    marginBottom: 20,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
});
