import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Alert,
  RefreshControl,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/StatusBadge';
import MetricCard from '@/components/MetricCard';
import RushAlertCard from '@/components/RushAlertCard';
import ManagerToolItem from '@/components/ManagerToolItem';
import BottomNavBar, { TabKey } from '@/components/BottomNavBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { useReservations } from '@/hooks/useReservations';

// ── Helpers ────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getLiveTime(): string {
  const d = new Date();
  const hh = d.getHours();
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 || 12;
  return `${h12}:${mm} ${ampm}`;
}

function getFormattedDate(): string {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

// Upcoming reservations mock data for the timeline
const UPCOMING_RESERVATIONS = [
  { id: '1', name: 'Elena Rostova', time: '6:30 PM', party: 4, table: 'T-12', status: 'confirmed' as const, isVip: true },
  { id: '2', name: 'David Chen', time: '7:00 PM', party: 2, table: 'T-5', status: 'confirmed' as const, isVip: false },
  { id: '3', name: 'Sophia Laurent', time: '7:30 PM', party: 6, table: 'T-8', status: 'pending' as const, isVip: true },
  { id: '4', name: 'James Miller', time: '8:00 PM', party: 3, table: 'T-3', status: 'confirmed' as const, isVip: false },
];

// Floor zone data
const FLOOR_ZONES = [
  { zone: 'Main Dining', tables: 12, occupied: 9, color: '#009669' },
  { zone: 'Patio', tables: 5, occupied: 3, color: '#0D9488' },
  { zone: 'Private Bar', tables: 3, occupied: 2, color: '#09055bff' },
];

// ── Component ──────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { overview, refreshing, refresh, addBooking, addWalkIn } = useReservations();

  // Active bottom nav tab
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Live clock
  const [liveTime, setLiveTime] = useState(getLiveTime());
  useEffect(() => {
    const id = setInterval(() => setLiveTime(getLiveTime()), 15_000);
    return () => clearInterval(id);
  }, []);

  // Fade-in animation for header
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Modal states
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [walkInModalVisible, setWalkInModalVisible] = useState(false);
  const [rushModalVisible, setRushModalVisible] = useState(false);

  // Booking form
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [bookingTime, setBookingTime] = useState('7:30 PM');
  const [tableNumber, setTableNumber] = useState('Table 5');
  const [bookingNotes, setBookingNotes] = useState('');

  // Walk-in form
  const [walkInName, setWalkInName] = useState('');
  const [walkInSize, setWalkInSize] = useState('2');
  const [walkInPhone, setWalkInPhone] = useState('');

  const handleCreateBooking = async () => {
    if (!guestName.trim()) {
      Alert.alert('Required', 'Please enter a guest name');
      return;
    }
    await addBooking({
      guestName: guestName.trim(),
      partySize: parseInt(partySize, 10) || 2,
      time: bookingTime,
      tableNumber,
      status: 'confirmed',
      notes: bookingNotes,
    });
    setGuestName('');
    setBookingNotes('');
    setBookingModalVisible(false);
    Alert.alert('Booking Confirmed', `Reservation added for ${guestName}`);
  };

  const handleCreateWalkIn = async () => {
    if (!walkInName.trim()) {
      Alert.alert('Required', 'Please enter the walk-in guest name');
      return;
    }
    await addWalkIn({
      guestName: walkInName.trim(),
      partySize: parseInt(walkInSize, 10) || 2,
      phone: walkInPhone,
    });
    setWalkInName('');
    setWalkInPhone('');
    setWalkInModalVisible(false);
    Alert.alert('Queue Updated', `${walkInName} has been added to the waitlist.`);
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab === 'bookings') router.push('/explore');
    else if (tab === 'tables') router.push('/tables');
    else if (tab === 'waitlist') router.push('/queue');
    else if (tab === 'alerts') router.push('/alerts');
  };

  // Derived values
  const occupancyRate = overview?.tablesOccupancyRate ?? 70;
  const totalCovers = (overview?.reservationsToday ?? 42) + (overview?.guestsInQueue ?? 6);
  const shiftProgressPercent = Math.min(100, Math.round((totalCovers / 120) * 100));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7EE" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={['#009669']}
              tintColor="#009669"
            />
          }>

          {/* ─── Top Bar ─────────────────────────────────────────── */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <View style={styles.serviceIconContainer}>
                <Icon name="utensils" size={18} color="#FFFFFF" />
              </View>
              <StatusBadge
                label={overview?.service || user?.service || 'DINNER SERVICE'}
                variant="green"
                dot
                size="medium"
              />
            </View>

            {/* Live clock pill */}
            <View style={styles.clockPill}>
              <Icon name="clock" size={13} color="#0c6c4fff" />
              <Text style={styles.clockText}>{liveTime}</Text>
            </View>

            {/* Avatar */}
            <Pressable
              onPress={() => router.push('/profile')}
              style={styles.avatarWrapper}>
              <Image
                source={require('@/assets/images/staff_avatar.jpg')}
                style={styles.avatarImage}
                defaultSource={require('@/assets/images/icon.png')}
              />
              <View style={styles.onlineBadge} />
            </Pressable>
          </View>

          {/* ─── Hero Greeting Section ───────────────────────────── */}
          <Animated.View
            style={[
              styles.heroSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}>
            <Text style={styles.dateText}>
              {overview?.date || getFormattedDate().toUpperCase()}
            </Text>
            <Text style={styles.greetingText}>
              {getGreeting()},{' '}
              <Text style={styles.greetingName}>
                {user?.name?.split(' ')[0] || 'Sarah'}
              </Text>
            </Text>
            <Text style={styles.greetingSubtitle}>
              Here's your shift overview — {overview?.reservationsToday ?? 42} covers booked today
            </Text>

            {/* Shift progress mini-bar */}
            <View style={styles.shiftProgressContainer}>
              <View style={styles.shiftProgressHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Icon name="chart" size={14} color="#047857" />
                  <Text style={styles.shiftProgressLabel}>Shift Progress</Text>
                </View>
                <Text style={styles.shiftProgressValue}>{shiftProgressPercent}% of target</Text>
              </View>
              <View style={styles.shiftProgressTrack}>
                <View style={[styles.shiftProgressFill, { width: `${shiftProgressPercent}%` }]} />
              </View>
            </View>
          </Animated.View>

          {/* ─── 2×2 Metric Cards Grid ───────────────────────────── */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <MetricCard
                icon="calendar"
                iconBgColor="#E6F8F0"
                iconColor="#009669"
                badgeLabel={`+${overview?.newReservations ?? 4} new`}
                badgeVariant="green"
                badgeDot
                value={overview?.reservationsToday ?? 42}
                label="Reservations today"
                onPress={() => router.push('/explore')}
              />
              <MetricCard
                icon="users"
                iconBgColor="#FEF3C7"
                iconColor="#D97706"
                badgeLabel={`~${overview?.queueWaitMinutes ?? 12} min`}
                badgeVariant="amber"
                value={overview?.guestsInQueue ?? 6}
                label="Guests in queue"
                onPress={() => router.push('/queue')}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                icon="grid"
                iconBgColor="#CCFBF1"
                iconColor="#0D9488"
                badgeLabel={`${occupancyRate}%`}
                badgeVariant="teal"
                value={overview?.occupiedTables ?? 14}
                subValue={`/ ${overview?.totalTables ?? 20}`}
                progressPercentage={occupancyRate}
                label="Tables occupied"
                onPress={() => router.push('/tables')}
              />
              <MetricCard
                icon="target"
                iconBgColor="#FFE4E6"
                iconColor="#E11D48"
                badgeLabel={overview?.noShowRateLabel ?? 'Low rate'}
                badgeVariant="gray"
                value={overview?.noShowsToday ?? 2}
                label="No-shows today"
                onPress={() =>
                  Alert.alert('No-Show Rate', '2 no-shows recorded during lunch shift.')
                }
              />
            </View>
          </View>

          {/* ─── Rush Alert Card ─────────────────────────────────── */}
          <RushAlertCard
            time={overview?.rushAlert?.time ?? '7:30 PM'}
            expectedGuests={overview?.rushAlert?.expectedGuests ?? 18}
            withinMinutes={overview?.rushAlert?.withinMinutes ?? 45}
            onPressView={() => setRushModalVisible(true)}
          />

          {/* ─── Quick Actions Row ───────────────────────────────── */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={() => setWalkInModalVisible(true)}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="walk" size={20} color="#D97706" />
              </View>
              <Text style={styles.actionCardLabel}>Walk-in</Text>
              <Text style={styles.actionCardSub}>Add to queue</Text>
            </Pressable>

            <Pressable
              onPress={() => setBookingModalVisible(true)}
              style={({ pressed }) => [styles.newBookingCard, pressed && styles.actionPressed]}>
              <View style={styles.newBookingIconRing}>
                <Icon name="plus" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.newBookingLabel}>New Booking</Text>
              <Text style={styles.newBookingSub}>Reserve table</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/tables')}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#E0E7FF' }]}>
                <Icon name="table" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.actionCardLabel}>Floor Plan</Text>
              <Text style={styles.actionCardSub}>Manage tables</Text>
            </Pressable>
          </View>

          {/* ─── Upcoming Reservations Timeline ──────────────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                <View style={styles.sectionCountBadge}>
                  <Text style={styles.sectionCountText}>{UPCOMING_RESERVATIONS.length}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [styles.seeAllBtn, pressed && styles.actionPressed]}>
                <Text style={styles.seeAllText}>See All</Text>
                <Icon name="chevron-right" size={14} color="#009669" />
              </Pressable>
            </View>

            <View style={styles.timelineContainer}>
              {UPCOMING_RESERVATIONS.map((res, idx) => (
                <Pressable
                  key={res.id}
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [
                    styles.timelineItem,
                    idx === UPCOMING_RESERVATIONS.length - 1 && styles.timelineItemLast,
                    pressed && styles.actionPressed,
                  ]}>
                  {/* Timeline dot & line */}
                  <View style={styles.timelineDotCol}>
                    <View style={[
                      styles.timelineDot,
                      res.status === 'pending' && styles.timelineDotPending,
                    ]} />
                    {idx < UPCOMING_RESERVATIONS.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  {/* Card content */}
                  <View style={styles.timelineCard}>
                    <View style={styles.timelineCardTop}>
                      <View style={styles.timelineNameRow}>
                        <Text style={styles.timelineGuestName}>{res.name}</Text>
                        {res.isVip && (
                          <View style={styles.vipBadge}>
                            <Icon name="star" size={10} color="#D97706" />
                            <Text style={styles.vipBadgeText}>VIP</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.timelineTime}>{res.time}</Text>
                    </View>
                    <View style={styles.timelineCardBottom}>
                      <View style={styles.timelineMetaItem}>
                        <Icon name="users" size={12} color="#6B7280" />
                        <Text style={styles.timelineMetaText}>{res.party} guests</Text>
                      </View>
                      <View style={styles.timelineMetaItem}>
                        <Icon name="grid" size={12} color="#6B7280" />
                        <Text style={styles.timelineMetaText}>{res.table}</Text>
                      </View>
                      <StatusBadge
                        label={res.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        variant={res.status === 'confirmed' ? 'green' : 'amber'}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ─── Floor Zone Heatmap Summary ───────────────────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Floor Zones</Text>
              <Pressable
                onPress={() => router.push('/tables')}
                style={({ pressed }) => [styles.seeAllBtn, pressed && styles.actionPressed]}>
                <Text style={styles.seeAllText}>View Map</Text>
                <Icon name="chevron-right" size={14} color="#009669" />
              </Pressable>
            </View>

            <View style={styles.floorZonesRow}>
              {FLOOR_ZONES.map((zone) => {
                const pct = Math.round((zone.occupied / zone.tables) * 100);
                return (
                  <View key={zone.zone} style={styles.floorZoneCard}>
                    <View style={[styles.floorZoneBar, { backgroundColor: zone.color + '20' }]}>
                      <View
                        style={[
                          styles.floorZoneBarFill,
                          { width: `${pct}%`, backgroundColor: zone.color },
                        ]}
                      />
                    </View>
                    <Text style={styles.floorZoneName}>{zone.zone}</Text>
                    <Text style={styles.floorZoneStats}>
                      {zone.occupied}/{zone.tables}
                    </Text>
                    <Text style={[styles.floorZonePct, { color: zone.color }]}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ─── Manager Tools Section ────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Manager Tools</Text>
              <Pressable
                onPress={() => router.push('/profile')}
                style={({ pressed }) => [styles.seeAllBtn, pressed && styles.actionPressed]}>
                <Text style={styles.seeAllText}>Quick Access</Text>
                <Icon name="chevron-right" size={14} color="#009669" />
              </Pressable>
            </View>

            <View style={styles.toolsCardContainer}>
              <ManagerToolItem
                icon="users"
                iconBgColor="#10B981"
                iconColor="#FFFFFF"
                title="Staff Accounts"
                subtitle={`${overview?.managerTools?.staffOnShift ?? 8} staff currently on shift`}
                hasActiveDot
                onPress={() =>
                  Alert.alert(
                    'Staff on Duty',
                    '8 staff members active:\n• 1 Shift Lead\n• 1 Host\n• 4 Servers\n• 2 Kitchen Line'
                  )
                }
              />
              <ManagerToolItem
                icon="gear"
                iconBgColor="#3B82F6"
                iconColor="#FFFFFF"
                title="Restaurant Settings"
                subtitle={
                  overview?.managerTools?.settingsSubtitle ??
                  'Hours, kitchen pacing, notifications'
                }
                onPress={() =>
                  Alert.alert(
                    'Restaurant Settings',
                    'Kitchen pacing: Standard (15 min interval per 6 covers).'
                  )
                }
              />
              <ManagerToolItem
                icon="table"
                iconBgColor="#06B6D4"
                iconColor="#FFFFFF"
                title="Table Setup & Floor Plan"
                subtitle={
                  overview?.managerTools?.floorPlanSubtitle ??
                  'Main room, Patio & Private bar'
                }
                onPress={() => router.push('/tables')}
              />
              <ManagerToolItem
                icon="chart"
                iconBgColor="#4F46E5"
                iconColor="#FFFFFF"
                title="Reports & Analytics"
                subtitle={
                  overview?.managerTools?.analyticsSubtitle ??
                  'Pacing, table turns & revenue pace'
                }
                showDivider={false}
                onPress={() =>
                  Alert.alert(
                    'Shift Analytics',
                    'Current Table Turn Pace: 1.4×\nProjected Covers: 110\nRevenue pace: $8,240'
                  )
                }
              />
            </View>
          </View>

          {/* Bottom spacer */}
          <View style={{ height: 8 }} />
        </ScrollView>

        {/* ─── Bottom Navigation Bar ─────────────────────────────── */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          waitlistCount={overview?.guestsInQueue ?? 4}
        />
      </View>

      {/* ─── New Booking Modal ──────────────────────────────────── */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBookingModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalDragHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Reservation</Text>
                <Text style={styles.modalSubtitle}>Fill in guest details to book a table</Text>
              </View>
              <Pressable
                onPress={() => setBookingModalVisible(false)}
                style={styles.modalCloseBtn}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Input
              label="Guest Name"
              placeholder="e.g. Elena Rostova"
              value={guestName}
              onChangeText={setGuestName}
              icon="person"
            />

            <View style={styles.modalRow}>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Party Size"
                  placeholder="2"
                  keyboardType="numeric"
                  value={partySize}
                  onChangeText={setPartySize}
                  icon="users"
                />
              </View>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Reservation Time"
                  placeholder="7:30 PM"
                  value={bookingTime}
                  onChangeText={setBookingTime}
                  icon="clock"
                />
              </View>
            </View>

            <Input
              label="Assign Table (Optional)"
              placeholder="Table 5"
              value={tableNumber}
              onChangeText={setTableNumber}
              icon="table"
            />

            <Input
              label="Special Notes / Requests"
              placeholder="Window booth, Anniversary, Allergies..."
              value={bookingNotes}
              onChangeText={setBookingNotes}
              multiline
              numberOfLines={2}
            />

            <View style={styles.modalActions}>
              <Button
                label="Cancel"
                variant="white"
                onPress={() => setBookingModalVisible(false)}
                style={styles.modalActionBtn}
              />
              <Button
                label="Save Booking"
                variant="primary"
                onPress={handleCreateBooking}
                style={styles.modalActionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Walk-in Modal ─────────────────────────────────────── */}
      <Modal
        visible={walkInModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setWalkInModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalDragHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Walk-in</Text>
                <Text style={styles.modalSubtitle}>Add guest to the waitlist queue</Text>
              </View>
              <Pressable
                onPress={() => setWalkInModalVisible(false)}
                style={styles.modalCloseBtn}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Input
              label="Guest Name"
              placeholder="e.g. David Vance"
              value={walkInName}
              onChangeText={setWalkInName}
              icon="person"
            />

            <View style={styles.modalRow}>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Party Size"
                  placeholder="2"
                  keyboardType="numeric"
                  value={walkInSize}
                  onChangeText={setWalkInSize}
                  icon="users"
                />
              </View>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Phone Number"
                  placeholder="+1 555 0192"
                  keyboardType="phone-pad"
                  value={walkInPhone}
                  onChangeText={setWalkInPhone}
                  icon="phone"
                />
              </View>
            </View>

            <View style={styles.modalInfoNotice}>
              <View style={styles.modalInfoIcon}>
                <Icon name="clock" size={15} color="#D97706" />
              </View>
              <Text style={styles.modalInfoText}>
                Estimated wait time: ~{overview?.queueWaitMinutes ?? 12} minutes based on current turn rate.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                label="Cancel"
                variant="white"
                onPress={() => setWalkInModalVisible(false)}
                style={styles.modalActionBtn}
              />
              <Button
                label="Add to Queue"
                variant="primary"
                onPress={handleCreateWalkIn}
                style={styles.modalActionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Rush Details Modal ────────────────────────────────── */}
      <Modal
        visible={rushModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRushModalVisible(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.rushModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Upcoming Dinner Rush</Text>
                <Text style={styles.modalSubtitle}>Prepare for peak capacity</Text>
              </View>
              <Pressable
                onPress={() => setRushModalVisible(false)}
                style={styles.modalCloseBtn}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <View style={styles.rushDetailBox}>
              <View style={styles.rushDetailIconRow}>
                <Icon name="flash" size={18} color="#EA580C" />
                <Text style={styles.rushDetailTime}>Peak: 7:30 PM – 8:15 PM</Text>
              </View>
              <Text style={styles.rushDetailSummary}>
                18 expected covers arriving across 6 reservations and 2 queue entries.
              </Text>
            </View>

            <View style={styles.rushTipsContainer}>
              <Text style={styles.rushTipTitle}>Recommendations:</Text>
              <Text style={styles.rushTipItem}>
                • Pre-stage silverware and waters on Tables 4, 7, and 12.
              </Text>
              <Text style={styles.rushTipItem}>
                • Inform kitchen lead of 6-top seating at 7:30 PM.
              </Text>
              <Text style={styles.rushTipItem}>
                • Maintain bar queue seating for 2-tops.
              </Text>
            </View>

            <Button
              label="Acknowledge & Prepare"
              variant="primary"
              onPress={() => setRushModalVisible(false)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F7EE',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F7EE',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },

  // ── Top Bar ──────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    flexShrink: 0,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 112, 80, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 150, 105, 0.15)',
  },
  clockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007A55',
    letterSpacing: 0.3,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // ── Hero Section ─────────────────────────────────
  heroSection: {
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  dateText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#114e3aff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingName: {
    color: '#0b654aff',
  },
  greetingSubtitle: {
    fontSize: 13.5,
    fontWeight: '400',
    color: '#033e10ff',
    lineHeight: 20,
    marginBottom: 14,
  },

  // Shift progress
  shiftProgressContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderTopColor: '#F0FDF4',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shiftProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  shiftProgressLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#065F46',
  },
  shiftProgressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  shiftProgressTrack: {
    height: 7,
    backgroundColor: '#D1FAE5',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  shiftProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3.5,
  },

  // ── Metrics Grid ─────────────────────────────────
  metricsGrid: {
    gap: 8,
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // ── Quick Actions ────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    marginVertical: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    gap: 4,
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionCardLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionCardSub: {
    fontSize: 10.5,
    fontWeight: '400',
    color: '#94A3B8',
  },
  newBookingCard: {
    flex: 1.3,
    backgroundColor: '#009669',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#059669',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 4,
    gap: 4,
  },
  newBookingIconRing: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  newBookingLabel: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  newBookingSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10.5,
    fontWeight: '400',
  },
  actionPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.975 }],
  },

  // ── Section Blocks ───────────────────────────────
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 19.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionCountBadge: {
    backgroundColor: '#009669',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  seeAllText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#009669',
  },

  // ── Timeline ─────────────────────────────────────
  timelineContainer: {},
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineItemLast: {},
  timelineDotCol: {
    width: 24,
    alignItems: 'center',
    paddingTop: 6,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#009669',
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  timelineDotPending: {
    backgroundColor: '#F59E0B',
    borderColor: '#FEF3C7',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: -4,
    alignSelf: 'center',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginLeft: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  timelineCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  timelineGuestName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  vipBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.4,
  },
  timelineTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#009669',
  },
  timelineCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  timelineMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },

  // ── Floor Zones ──────────────────────────────────
  floorZonesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  floorZoneCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  floorZoneBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  floorZoneBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  floorZoneName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 3,
    textAlign: 'center',
  },
  floorZoneStats: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 2,
  },
  floorZonePct: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  // ── Manager Tools ────────────────────────────────
  toolsCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
  },

  // ── Modals ───────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '90%',
  },
  rushModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 420,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalHalfCol: {
    flex: 1,
  },
  modalInfoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  modalInfoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInfoText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#92400E',
    flex: 1,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalActionBtn: {
    flex: 1,
  },

  // ── Rush Modal ───────────────────────────────────
  rushDetailBox: {
    backgroundColor: '#FFF9F3',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 14,
  },
  rushDetailIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  rushDetailTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C2410C',
  },
  rushDetailSummary: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9A3412',
    lineHeight: 19,
  },
  rushTipsContainer: {
    backgroundColor: '#F8FAFB',
    padding: 14,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rushTipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  rushTipItem: {
    fontSize: 13,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 19,
  },
});
