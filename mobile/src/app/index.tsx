import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '../components/ui/Icon';

export default function LaunchHubScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Icon name="utensils" size={24} color="#00E599" />
          </View>
          <Text style={styles.appTitle}>Restaurant Portal</Text>
          <Text style={styles.appSubtitle}>
            IT3060 HCI Milestone 03 • Branch: feature/customer-staff
          </Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>READY FOR EXPO GO</Text>
          </View>
        </View>

        {/* Section 1: Customer Portal Screens */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#E8FAF0' }]}>
              <Icon name="person" size={18} color="#009669" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Customer Mobile Portal</Text>
              <Text style={styles.sectionSubtitle}>4 Assigned Customer UI Screens</Text>
            </View>
          </View>

          <View style={styles.buttonList}>
            {/* 1. Join Queue */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/join-queue')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#009669' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>1. Join the Queue</Text>
                  <Text style={styles.screenBtnSub}>Wait time, party stepper & preferences</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>

            {/* 2. Your Queue */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/queue')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#009669' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>2. Your Queue Tracker</Text>
                  <Text style={styles.screenBtnSub}>Live #3 position, progress & specials</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>

            {/* 3. Notifications */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/alerts')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#009669' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>3. Notifications</Text>
                  <Text style={styles.screenBtnSub}>Table ready, reminders & unread badges</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>

            {/* 4. Customer Profile */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/customer-profile')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#009669' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>4. Customer Profile & Settings</Text>
                  <Text style={styles.screenBtnSub}>Amara Chen, loyalty points & Log Out</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Section 2: Staff Portal Screens */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
              <Icon name="gear" size={18} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Staff Mobile Portal</Text>
              <Text style={styles.sectionSubtitle}>4 Assigned Staff UI Screens</Text>
            </View>
          </View>

          <View style={styles.buttonList}>
            {/* 1. Staff Sign In */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/login')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#4F46E5' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>1. Staff Sign In</Text>
                  <Text style={styles.screenBtnSub}>Staff access badge, credentials & quick fill</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>

            {/* 2. Staff Dashboard */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/dashboard')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#4F46E5' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>2. Staff Dashboard Overview</Text>
                  <Text style={styles.screenBtnSub}>2x2 metrics, rush alert & new booking</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>

            {/* 3. Staff Accounts */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/staff-accounts')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#4F46E5' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>3. Staff Accounts Management</Text>
                  <Text style={styles.screenBtnSub}>Full CRUD: roster, duty toggle & search</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>

            {/* 4. Staff Profile */}
            <Pressable
              style={({ pressed }) => [styles.screenBtn, pressed && styles.pressed]}
              onPress={() => router.push('/staff-profile')}
            >
              <View style={styles.screenBtnLeft}>
                <View style={[styles.btnDot, { backgroundColor: '#4F46E5' }]} />
                <View>
                  <Text style={styles.screenBtnTitle}>4. Staff Profile & Settings</Text>
                  <Text style={styles.screenBtnSub}>Kaweerna Sneha, on shift & table map</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#181A1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 180, 120, 0.2)',
    marginTop: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  buttonList: {
    gap: 8,
  },
  screenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#F3F4F6',
  },
  screenBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  btnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  screenBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  screenBtnSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
