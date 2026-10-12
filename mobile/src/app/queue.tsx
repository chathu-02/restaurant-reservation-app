import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import customerQueueService from '@/services/customerQueue.service';
import { CustomerQueueStatus } from '@/types';
import { formatPhoneDisplay } from '@/lib/phone';

export default function QueueTrackerScreen() {
  const params = useLocalSearchParams<{ queueId?: string }>();
  const [queueData, setQueueData] = useState<CustomerQueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Load customer's actual queue entry data
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const loadQueue = async () => {
      try {
        setLoading(true);
        const stored = await customerQueueService.getStoredQueue();

        if (isMounted) {
          if (stored) {
            setQueueData(stored);

            // Subscribe to live Firestore updates if available
            unsubscribe = customerQueueService.subscribeToQueue(stored.id, (updates) => {
              if (isMounted) {
                setQueueData((prev) => (prev ? { ...prev, ...updates } : null));
              }
            });
          } else {
            setQueueData(null);
          }
        }
      } catch (err) {
        console.warn('QueueTrackerScreen load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQueue();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [params.queueId]);

  const handleLeaveQueue = () => {
    const confirmMessage = 'Are you sure you want to leave the queue? You will lose your current spot in line.';

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(confirmMessage);
      if (confirmed) {
        performLeave();
      }
    } else {
      Alert.alert('Leave Queue', confirmMessage, [
        { text: 'Stay in Line', style: 'cancel' },
        {
          text: 'Leave Queue',
          style: 'destructive',
          onPress: performLeave,
        },
      ]);
    }
  };

  const performLeave = async () => {
    try {
      setIsLeaving(true);
      await customerQueueService.leaveQueue(queueData?.id);

      if (Platform.OS !== 'web') {
        Alert.alert('Queue Released', 'You have successfully left the queue.');
      } else {
        window.alert('You have successfully left the queue.');
      }

      router.replace('/(customer)/(tabs)/home' as never);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not leave queue. Please try again.');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleExploreMenu = () => {
    router.push('/menu' as never);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color="#00B37E" />
        <Text style={styles.loadingText}>Loading queue details...</Text>
      </SafeAreaView>
    );
  }

  // Fallback if no queue entry is found
  if (!queueData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={() => router.replace('/(customer)/(tabs)/home' as never)}
          >
            <Icon name="chevron-left" size={20} color="#111827" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Your Queue</Text>
            <Text style={styles.headerSubtitle}>The Green Terrace • Riverside Ave</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Icon name="users" size={32} color="#009669" />
          </View>
          <Text style={styles.emptyTitle}>You're Not in Queue</Text>
          <Text style={styles.emptySubtitle}>
            Join the live line to reserve a table without waiting in person.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed, { width: '100%', marginTop: 24 }]}
            onPress={() => router.push('/join-queue')}
          >
            <Text style={styles.exploreBtnText}>Join the Queue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Progress Bar calculation
  const progressPercent = Math.min(
    95,
    Math.max(20, 100 - (queueData.tablesAhead || 0) * 15)
  );

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
              {queueData.restaurantName}{' '}
              <Text style={{ color: '#9CA3AF' }}>• {queueData.restaurantLocation}</Text>
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
            <Text style={styles.bigNumber}>{queueData.position}</Text>
            <View style={styles.numberTag}>
              <Text style={styles.numberTagText}>#{queueData.position}</Text>
            </View>
          </View>

          <Text style={styles.numberLabel}>Your position in line</Text>

          {/* Wait Time Pill */}
          <View style={styles.waitPill}>
            <Icon name="clock" size={14} color="#34D399" />
            <Text style={styles.waitPillText}>
              Estimated wait ~{queueData.estimatedWaitMin} min
            </Text>
          </View>

          {/* Progress Box */}
          <View style={styles.progressBox}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.tablesAheadText}>
                {queueData.tablesAhead}{' '}
                {queueData.tablesAhead === 1 ? 'table' : 'tables'} ahead
              </Text>
              <Text style={styles.initialWaitText}>
                Initial wait: {queueData.initialWaitMin}m
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>

            <View style={styles.turnoverRow}>
              <Icon name="zap" size={13} color="#059669" />
              <Text style={styles.turnoverText}>
                Turnover pace: {queueData.turnoverPace}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Actual Entered Details Cards */}
        <View style={styles.detailRow}>
          <View style={styles.detailCard}>
            <View style={styles.detailIconBox}>
              <Icon name="users" size={16} color="#4B5563" />
            </View>
            <Text style={styles.detailLabel}>PARTY</Text>
            <Text style={styles.detailValue}>
              {queueData.partySize} {queueData.partySize === 1 ? 'Guest' : 'Guests'}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconBox}>
              <Icon name="clock" size={16} color="#4B5563" />
            </View>
            <Text style={styles.detailLabel}>JOINED</Text>
            <Text style={styles.detailValue}>{queueData.joinedTime}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={[styles.detailIconBox, { backgroundColor: '#E8FAF0' }]}>
              <Icon
                name={queueData.seatingPreference === 'Outdoor' ? 'leaf' : 'armchair'}
                size={16}
                color="#009669"
              />
            </View>
            <Text style={styles.detailLabel}>SEATING</Text>
            <Text style={styles.detailValue}>{queueData.seatingPreference}</Text>
          </View>
        </View>

        {/* Guest Information Card */}
        <View style={styles.guestInfoCard}>
          <View style={styles.guestInfoRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {queueData.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guestName}>{queueData.fullName}</Text>
              <Text style={styles.guestPhone}>
                {formatPhoneDisplay(queueData.phoneNumber)}
              </Text>
            </View>
            <View style={styles.waitingStatusPill}>
              <Text style={styles.waitingStatusText}>
                {queueData.status === 'READY'
                  ? 'TABLE READY'
                  : queueData.status === 'SEATED'
                  ? 'SEATED'
                  : 'WAITING'}
              </Text>
            </View>
          </View>

          {queueData.specialRequests ? (
            <View style={styles.notesBox}>
              <Icon name="edit" size={14} color="#6B7280" />
              <Text style={styles.notesText}>
                <Text style={{ fontWeight: '700', color: '#374151' }}>Special Request:</Text>{' '}
                {queueData.specialRequests}
              </Text>
            </View>
          ) : null}
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
                Please stay within <Text style={{ fontWeight: '800' }}>5 minutes</Text> of the restaurant. You'll receive a ready chime and text message to{' '}
                <Text style={{ fontWeight: '700' }}>{formatPhoneDisplay(queueData.phoneNumber)}</Text>.
              </Text>
            </View>
          </View>

          <View style={styles.alertDivider} />

          <View style={styles.alertFooter}>
            <View style={styles.floorStatusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.floorStatusText}>
                Floor status: {queueData.floorStatus}
              </Text>
            </View>
            <Text style={styles.justNowText}>{queueData.lastUpdated}</Text>
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
          style={({ pressed }) => [
            styles.leaveBtn,
            isLeaving && styles.disabledBtn,
            pressed && !isLeaving && styles.pressed,
          ]}
          onPress={handleLeaveQueue}
          disabled={isLeaving}
        >
          {isLeaving ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <>
              <Icon name="logout" size={16} color="#EF4444" />
              <Text style={styles.leaveBtnText}>Leave Queue</Text>
            </>
          )}
        </Pressable>
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
    padding: 16,
    paddingBottom: 28,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8FAF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
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
  guestInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 12,
  },
  guestInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#181A1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  guestName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  guestPhone: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 1,
  },
  waitingStatusPill: {
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  waitingStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.4,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
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
  disabledBtn: {
    opacity: 0.6,
  },
  leaveBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
  },
});
