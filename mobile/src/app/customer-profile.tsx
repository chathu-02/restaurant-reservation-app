import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';

export default function CustomerProfileScreen() {
  const [reminders, setReminders] = useState(true);
  const [queueAlerts, setQueueAlerts] = useState(true);
  const [notifExpanded, setNotifExpanded] = useState(true);

  const handleEditDetails = () => {
    Alert.prompt
      ? Alert.prompt(
          'Edit Profile Name',
          'Update your display name',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Save', onPress: () => Alert.alert('Updated', 'Name updated successfully') },
          ],
          'plain-text',
          'Amara Chen'
        )
      : Alert.alert('Edit Personal Details', 'Name: Amara Chen\nEmail: amara.chen@email.com\nPhone: (555) 439-9201');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'A password reset link has been dispatched to amara.chen@email.com.');
  };

  const handlePaymentMethods = () => {
    Alert.alert('Payment Methods', 'Default: Apple Pay (Visa ending in 4022)\nStatus: Verified');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out of Account',
      'Are you sure you want to log out, Amara? Your active queue position will remain saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Logged Out', 'You have been safely signed out.');
            router.replace('/join-queue');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
            onPress={handleEditDetails}
          >
            <Icon name="edit" size={18} color="#111827" />
          </Pressable>
        </View>

        {/* Profile Hero Card */}
        <View style={styles.profileCard}>
          {/* Avatar with Camera Badge */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.userName}>Amara Chen</Text>
          <Text style={styles.userEmail}>amara.chen@email.com</Text>

          {/* Preferred Guest Badge */}
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>PREFERRED GUEST • 18 VISITS</Text>
          </View>

          {/* 3 Stats Columns */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>

            <View style={[styles.statCol, styles.statBorder]}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Queue Saves</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: '#00B37E' }]}>450</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        {/* Section: ACCOUNT */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.cardGroup}>
            {/* 1. Edit personal details */}
            <Pressable
              style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
              onPress={handleEditDetails}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="person" size={18} color="#4F46E5" />
                </View>
                <Text style={styles.rowTitle}>Edit personal details</Text>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </Pressable>

            <View style={styles.divider} />

            {/* 2. Change password */}
            <Pressable
              style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
              onPress={handleChangePassword}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="lock" size={18} color="#4F46E5" />
                </View>
                <Text style={styles.rowTitle}>Change password</Text>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </Pressable>

            <View style={styles.divider} />

            {/* 3. Payment methods */}
            <Pressable
              style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
              onPress={handlePaymentMethods}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="card" size={18} color="#4F46E5" />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Payment methods</Text>
                  <Text style={styles.rowSub}>Apple Pay, Visa ending in 4022</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Section: PREFERENCES */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.cardGroup}>
            {/* Accordion header */}
            <Pressable
              style={styles.accordionHeader}
              onPress={() => setNotifExpanded(!notifExpanded)}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="bell" size={18} color="#4F46E5" />
                </View>
                <Text style={styles.rowTitle}>Notification settings</Text>
              </View>
              <Icon
                name={notifExpanded ? 'chevron-right' : 'chevron-right'}
                size={16}
                color="#9CA3AF"
              />
            </Pressable>

            {/* Accordion sub-items */}
            {notifExpanded && (
              <View style={styles.accordionBody}>
                {/* Reminders */}
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleTitle}>Reminders</Text>
                    <Text style={styles.toggleSub}>Upcoming bookings 2h & 24h prior</Text>
                  </View>
                  <Switch
                    value={reminders}
                    onValueChange={setReminders}
                    trackColor={{ false: '#D1D5DB', true: '#009669' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={[styles.divider, { marginLeft: 16 }]} />

                {/* Queue alerts */}
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleTitle}>Queue alerts</Text>
                    <Text style={styles.toggleSub}>Position changes and table calls</Text>
                  </View>
                  <Switch
                    value={queueAlerts}
                    onValueChange={setQueueAlerts}
                    trackColor={{ false: '#D1D5DB', true: '#009669' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* LOGOUT BUTTON (Explicitly requested by user) */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={18} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Log Out of Account</Text>
        </Pressable>
      </ScrollView>

      {/* Customer Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/join-queue')}>
          <Icon name="utensils" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/alerts')}>
          <Icon name="calendar" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Bookings</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/queue')}>
          <Icon name="clock" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Queue</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/alerts')}>
          <Icon name="bell" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Alerts</Text>
        </Pressable>
        <Pressable style={styles.navItemActive} onPress={() => {}}>
          <Icon name="person" size={20} color="#009669" />
          <Text style={styles.navTextActive}>Profile</Text>
          <View style={styles.activeDot} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#A7F3D0',
    backgroundColor: '#E5E7EB',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#181A1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,180,120,0.2)',
    marginBottom: 16,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F0',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#EEF2F0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  rowSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 62,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  accordionBody: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  toggleSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F0',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navItemActive: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#009669',
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#009669',
    marginTop: 2,
  },
});
