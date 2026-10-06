import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';

export default function QueueTrackerScreen() {
  const [position] = useState(3);
  const [tablesAhead] = useState(2);
  const [waitMin] = useState(15);

  const handleLeaveQueue = () => {
    Alert.alert(
      'Leave the Queue?',
      `You are currently #${position} in line with ~${waitMin} min wait remaining. Leaving now will release your spot.`,
      [
        { text: 'Stay in Line', style: 'cancel' },
        {
          text: 'Leave Queue',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Queue Released', 'You have left the queue.');
            router.replace('/join-queue');
          },
        },
      ]
    );
  };

  const handleExploreMenu = () => {
    Alert.alert(
      "Today's Chef Specials",
      '1. Pan-Seared Sea Bass ($34)\n2. Truffle Wild Mushroom Tagliatelle ($28.50)\n3. Smoked Duck Breast ($36)\n\nComplimentary amuse-bouche upon seating!'
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
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={() => router.back()}
          >
            <Icon name="chevron-left" size={20} color="#111827" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Your Queue</Text>
              <View style={styles.titleDot} />
            </View>
            <Text style={styles.headerSubtitle}>
              The Green Terrace <Text style={{ color: '#9CA3AF' }}>• Riverside Ave</Text>
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={() => router.push('/alerts')}
          >
            <Icon name="bell" size={18} color="#111827" />
            <View style={styles.notifBadgeDot} />
          </Pressable>
        </View>

        {/* Live Queue Tracker Card */}
        <View style={styles.trackerCard}>
          <View style={styles.trackerBadge}>
            <View style={styles.trackerDot} />
            <Text style={styles.trackerBadgeText}>LIVE QUEUE TRACKER</Text>
          </View>

          {/* Position Number */}
          <View style={styles.numberRow}>
            <Text style={styles.bigNumber}>{position}</Text>
            <View style={styles.numberTag}>
              <Text style={styles.numberTagText}>#{position}</Text>
            </View>
          </View>

          <Text style={styles.numberLabel}>Your position in line</Text>

          {/* Wait Time Pill */}
          <View style={styles.waitPill}>
            <Icon name="clock" size={14} color="#34D399" />
            <Text style={styles.waitPillText}>Estimated wait ~{waitMin} min</Text>
          </View>

          {/* Progress Box */}
          <View style={styles.progressBox}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.tablesAheadText}>{tablesAhead} tables ahead</Text>
              <Text style={styles.initialWaitText}>Initial wait: 25m</Text>
            </View>

            <View style={styles.progressBarBg}>
              <View style={styles.progressBarFill} />
            </View>

            <View style={styles.turnoverRow}>
              <Icon name="zap" size={13} color="#059669" />
              <Text style={styles.turnoverText}>Turnover pace: Fast (~4 min/table)</Text>
            </View>
          </View>
        </View>

        {/* 3 Detail Cards in a Row */}
        <View style={styles.detailRow}>
          <View style={styles.detailCard}>
            <View style={styles.detailIconBox}>
              <Icon name="users" size={16} color="#4B5563" />
            </View>
            <Text style={styles.detailLabel}>PARTY</Text>
            <Text style={styles.detailValue}>2 Guests</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconBox}>
              <Icon name="clock" size={16} color="#4B5563" />
            </View>
            <Text style={styles.detailLabel}>JOINED</Text>
            <Text style={styles.detailValue}>6:40 PM</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={[styles.detailIconBox, { backgroundColor: '#E8FAF0' }]}>
              <Icon name="armchair" size={16} color="#009669" />
            </View>
            <Text style={styles.detailLabel}>SEATING</Text>
            <Text style={styles.detailValue}>Indoor</Text>
          </View>
        </View>

        {/* We'll alert you banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertTop}>
            <View style={styles.alertIconCircle}>
              <Icon name="bell" size={20} color="#009669" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.alertTitleRow}>
                <Text style={styles.alertTitle}>We'll alert you when ready</Text>
                <View style={styles.smsBadge}>
                  <Text style={styles.smsText}>SMS</Text>
                </View>
              </View>
              <Text style={styles.alertBody}>
                Please stay within <Text style={{ fontWeight: '800' }}>5 minutes</Text> of the restaurant. You'll receive a ready chime and text message.
              </Text>
            </View>
          </View>

          <View style={styles.alertDivider} />

          <View style={styles.alertFooter}>
            <View style={styles.floorStatusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.floorStatusText}>Floor status: Table clearing in progress</Text>
            </View>
            <Text style={styles.justNowText}>Just now</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Pressable
          style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}
          onPress={handleExploreMenu}
        >
          <Text style={styles.exploreBtnText}>Explore Menu & Daily Specials</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.leaveBtn, pressed && styles.pressed]}
          onPress={handleLeaveQueue}
        >
          <Icon name="logout" size={16} color="#EF4444" />
          <Text style={styles.leaveBtnText}>Leave Queue</Text>
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
        <Pressable style={styles.navItemActive} onPress={() => {}}>
          <Icon name="clock" size={20} color="#009669" />
          <Text style={styles.navTextActive}>Queue</Text>
          <View style={styles.activeDot} />
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/alerts')}>
          <Icon name="bell" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Alerts</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/customer-profile')}>
          <Icon name="person" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Profile</Text>
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
    marginBottom: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B37E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  titleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B37E',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009669',
    marginTop: 2,
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 12,
  },
  trackerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,180,120,0.2)',
    marginBottom: 8,
  },
  trackerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  trackerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.6,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  bigNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 70,
  },
  numberTag: {
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
    marginTop: 8,
  },
  numberTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
  },
  numberLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
  },
  waitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#181A1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 16,
  },
  waitPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tablesAheadText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#009669',
  },
  initialWaitText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    width: '65%',
    backgroundColor: '#00B37E',
    borderRadius: 4,
  },
  turnoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  turnoverText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00875A',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  detailIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  alertBanner: {
    backgroundColor: '#E8FAF0',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,180,120,0.2)',
    marginBottom: 14,
  },
  alertTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  alertIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  smsBadge: {
    backgroundColor: '#00B37E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  smsText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  alertBody: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  alertDivider: {
    height: 1,
    backgroundColor: 'rgba(0,180,120,0.15)',
    marginVertical: 10,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floorStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  floorStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00875A',
  },
  justNowText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  exploreBtn: {
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  leaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    paddingVertical: 14,
  },
  leaveBtnText: {
    color: '#EF4444',
    fontSize: 13,
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
    position: 'relative',
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
