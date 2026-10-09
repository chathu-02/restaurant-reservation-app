import React, { useState, useEffect } from 'react';
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
import { DashboardSkeleton } from '@/components/SkeletonLoader';
<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/components/logo';
import { BRAND } from '@/lib/brand';
=======
import { dateValue, formatTime, ReservationDoc, statusLabel } from '@/lib/booking';
import { subscribeKitchenReservations } from '@/lib/kitchen';
>>>>>>> Feature/Kitchen

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    overview,
    refreshing,
    refresh,
    addBooking,
    addWalkIn,
    reservations,
    unreadNotificationsCount,
    loading,
  } = useReservations();

  // Active bottom navigation tab
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256');

  useEffect(() => {
    if (user?.id) {
      AsyncStorage.getItem(`@profile_pic_${user.id}`).then(pic => {
        if (pic) setProfilePic(pic);
      });
    }
  }, [user?.id]);

  // Modals for actions
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [walkInModalVisible, setWalkInModalVisible] = useState(false);
  const [rushModalVisible, setRushModalVisible] = useState(false);
  const [kitchenReservations, setKitchenReservations] = useState<ReservationDoc[]>([]);

  // Form states for New Booking
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [bookingTime, setBookingTime] = useState('7:30 PM');
  const [tableNumber, setTableNumber] = useState('Table 5');
  const [bookingNotes, setBookingNotes] = useState('');

  // Form states for Walk-in
  const [walkInName, setWalkInName] = useState('');
  const [walkInSize, setWalkInSize] = useState('2');
  const [walkInPhone, setWalkInPhone] = useState('');

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    const stop = subscribeKitchenReservations(dateValue(new Date()), setKitchenReservations);
    return stop;
  }, []);

  // Live Clock String
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setLiveTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    };
    return now.toLocaleDateString('en-US', options);
  };

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
    if (tab === 'dashboard') router.push('/(staff)/manager' as never);
    else if (tab === 'bookings' || tab === 'reservations') router.push('/(staff)/manager/explore' as never);
    else if (tab === 'tables') router.push('/(staff)/manager/tables' as never);
    else if (tab === 'queue' || tab === 'waitlist') router.push('/(staff)/manager/queue' as never);
    else if (tab === 'alerts') router.push('/(staff)/manager/alerts' as never);
  };

  // Derived values
  const occupancyRate = overview?.tablesOccupancyRate ?? 70;
  const totalCovers = (overview?.reservationsToday ?? 42) + (overview?.guestsInQueue ?? 6);
  const shiftProgressPercent = Math.min(100, Math.round((totalCovers / 120) * 100));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#072c23ff" />
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
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* ─── Unified Dark Emerald Header & Greeting Section (#022C22) ─ */}
              <Animated.View
                style={[
                  styles.heroSection,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}>


                {/* Top Bar */}
<<<<<<< HEAD
                <View style={styles.topBar}>
                  <View style={[styles.topBarLeft, { flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Logo size={32} badge />
                    </View>
                    <StatusBadge
                      label={overview?.service || user?.service || 'DINNER SERVICE'}
                      variant="green"
                      dot
                      size="medium"
                    />
=======
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
                <Icon name="clock" size={13} color="#34D399" />
                <Text style={styles.clockText}>{liveTime}</Text>
              </View>

              {/* Profile Initial "C" */}
              <Pressable
                onPress={() => router.push('/(staff)/manager/profile' as never)}
                style={styles.avatarWrapper}>
                <View style={styles.avatarIconCircle}>
                  <Text style={styles.avatarInitialText}>C</Text>
                </View>
                <View style={styles.onlineBadge} />
              </Pressable>
            </View>

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

            {/* Shift progress card inside hero container */}
            <View style={styles.shiftProgressContainer}>
              <View style={styles.shiftProgressTopRow}>
                <View style={styles.progressCircleBadge}>
                  <Text style={styles.progressCircleText}>{shiftProgressPercent}%</Text>
                </View>
                <View style={styles.shiftProgressTextCol}>
                  <Text style={styles.shiftProgressLabel}>Shift progress</Text>
                  <Text style={styles.shiftProgressValue}>{shiftProgressPercent}% of target</Text>
                </View>
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
                cardBgColor="#ECFDF5"
                borderColor="#A7F3D0"
                iconBgColor="#10B981"
                iconColor="#FFFFFF"
                valueColor="#065F46"
                labelColor="#047857"
                badgeLabel={`+${overview?.newReservations ?? 4} new`}
                badgeVariant="green"
                badgeDot
                value={overview?.reservationsToday ?? 42}
                label="Reservations today"
              />
              <MetricCard
                icon="users"
                cardBgColor="#FFFBEB"
                borderColor="#FDE68A"
                iconBgColor="#F59E0B"
                iconColor="#FFFFFF"
                valueColor="#92400E"
                labelColor="#B45309"
                badgeLabel={`~${overview?.queueWaitMinutes ?? 12} min`}
                badgeVariant="amber"
                value={overview?.guestsInQueue ?? 6}
                label="Guests in queue"
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                icon="grid"
                cardBgColor="#F0FDFA"
                borderColor="#99F6E4"
                iconBgColor="#0D9488"
                iconColor="#FFFFFF"
                valueColor="#115E59"
                labelColor="#0F766E"
                badgeLabel={`${occupancyRate}%`}
                badgeVariant="teal"
                value={overview?.occupiedTables ?? 14}
                subValue={`/ ${overview?.totalTables ?? 20}`}
                progressPercentage={occupancyRate}
                label="Tables occupied"
              />
              <MetricCard
                icon="target"
                cardBgColor="#EFF6FF"
                borderColor="#BFDBFE"
                iconBgColor="#3B82F6"
                iconColor="#FFFFFF"
                valueColor="#1E40AF"
                labelColor="#1D4ED8"
                badgeLabel={overview?.noShowRateLabel ?? 'Low rate'}
                badgeVariant="gray"
                value={overview?.noShowsToday ?? 2}
                label="No-shows today"
              />
            </View>
          </View>

          <View style={styles.kitchenBoard}>
            <View style={styles.containerHeaderRow}>
              <View style={styles.containerHeaderLeft}>
                <View style={styles.kitchenLiveDot} />
                <Text style={styles.containerTitle}>Kitchen live board</Text>
              </View>
              <Pressable
                onPress={() => router.push('/kitchen' as never)}
                style={({ pressed }) => [styles.seeAllBtn, pressed && styles.actionPressed]}>
                <Text style={styles.seeAllText}>Open kitchen</Text>
                <Icon name="chevron-right" size={14} color="#009669" />
              </Pressable>
            </View>
            <Text style={styles.kitchenBoardSubtitle}>
              Customer and staff bookings update here automatically.
            </Text>
            {kitchenReservations.length === 0 ? (
              <Text style={styles.kitchenEmpty}>No active bookings for today.</Text>
            ) : (
              kitchenReservations.slice(0, 4).map((reservation) => (
                <View key={reservation.id} style={styles.kitchenRow}>
                  <View style={styles.kitchenTime}>
                    <Text style={styles.kitchenTimeText}>{formatTime(reservation.timeMinutes)}</Text>
                    <Text style={styles.kitchenPartyText}>{reservation.partySize} guests</Text>
                  </View>
                  <View style={styles.kitchenGuest}>
                    <Text style={styles.kitchenGuestName} numberOfLines={1}>{reservation.userName}</Text>
                    <Text style={styles.kitchenTable} numberOfLines={1}>
                      {(reservation.tableNames ?? []).join(', ') || 'Table pending'}
                    </Text>
                  </View>
                  <Text style={styles.kitchenStatus}>{statusLabel(reservation)}</Text>
                </View>
              ))
            )}
            {kitchenReservations.length > 4 && (
              <Text style={styles.kitchenMore}>+{kitchenReservations.length - 4} more bookings in kitchen</Text>
            )}
          </View>

          {/* ─── Rush Alert Card ─────────────────────────────────── */}
          <RushAlertCard
            time={overview?.rushAlert?.time ?? '7:30 PM'}
            expectedGuests={overview?.rushAlert?.expectedGuests ?? 18}
            withinMinutes={overview?.rushAlert?.withinMinutes ?? 45}
            onPressView={() => setRushModalVisible(true)}
          />

          {/* ─── Quick Actions Container ──────────────────────────── */}
          <View style={styles.lightGreenContainer}>
            <View style={styles.containerHeaderRow}>
              <View style={styles.containerHeaderLeft}>
                <Text style={styles.containerTitle}>Quick actions</Text>
              </View>
            </View>

            <View style={styles.quickActionsContainer}>
              {/* Full-width New Booking card on top */}
              <Pressable
                onPress={() => setBookingModalVisible(true)}
                style={({ pressed }) => [styles.fullWidthNewBookingCard, pressed && styles.actionPressed]}>
                <View style={styles.newBookingIconRing}>
                  <Icon name="plus" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.fullBookingTextCol}>
                  <Text style={styles.newBookingLabel}>New booking</Text>
                  <Text style={styles.newBookingSub}>Reserve table</Text>
                </View>
              </Pressable>

              {/* Bottom 2 side-by-side cards */}
              <View style={styles.bottomActionsRow}>
                <Pressable
                  onPress={() => router.push('/(staff)/manager/add-walkin' as never)}
                  style={({ pressed }) => [styles.actionCardHalf, pressed && styles.actionPressed]}>
                  <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                    <Icon name="walk" size={20} color="#D97706" />
>>>>>>> Feature/Kitchen
                  </View>

                  {/* Live clock pill */}
                  <View style={styles.clockPill}>
                    <Icon name="clock" size={13} color="#34D399" />
                    <Text style={styles.clockText}>{liveTime}</Text>
                  </View>

                  {/* Profile Initial "C" */}
                  <Pressable
                    onPress={() => router.push('/(staff)/manager/profile' as never)}
                    style={styles.avatarWrapper}>
                    <Image source={{ uri: profilePic }} style={styles.avatarIconCircle} />
                    <View style={styles.onlineBadge} />
                  </Pressable>
                </View>

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

                {/* Shift progress card inside hero container */}
                <View style={styles.shiftProgressContainer}>
                  <View style={styles.shiftProgressTopRow}>
                    <View style={styles.progressCircleBadge}>
                      <Text style={styles.progressCircleText}>{shiftProgressPercent}%</Text>
                    </View>
                    <View style={styles.shiftProgressTextCol}>
                      <Text style={styles.shiftProgressLabel}>Shift progress</Text>
                      <Text style={styles.shiftProgressValue}>{shiftProgressPercent}% of target</Text>
                    </View>
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
                    cardBgColor="#ECFDF5"
                    borderColor="#A7F3D0"
                    iconBgColor="#10B981"
                    iconColor="#FFFFFF"
                    valueColor="#065F46"
                    labelColor="#047857"
                    badgeLabel={`+${overview?.newReservations ?? 4} new`}
                    badgeVariant="green"
                    badgeDot
                    value={overview?.reservationsToday ?? 42}
                    label="Reservations today"
                  />
                  <MetricCard
                    icon="users"
                    cardBgColor="#FFFBEB"
                    borderColor="#FDE68A"
                    iconBgColor="#F59E0B"
                    iconColor="#FFFFFF"
                    valueColor="#92400E"
                    labelColor="#B45309"
                    badgeLabel={`~${overview?.queueWaitMinutes ?? 12} min`}
                    badgeVariant="amber"
                    value={overview?.guestsInQueue ?? 6}
                    label="Guests in queue"
                  />
                </View>
                <View style={styles.metricsRow}>
                  <MetricCard
                    icon="grid"
                    cardBgColor="#F0FDFA"
                    borderColor="#99F6E4"
                    iconBgColor="#0D9488"
                    iconColor="#FFFFFF"
                    valueColor="#115E59"
                    labelColor="#0F766E"
                    badgeLabel={`${occupancyRate}%`}
                    badgeVariant="teal"
                    value={overview?.occupiedTables ?? 14}
                    subValue={`/ ${overview?.totalTables ?? 20}`}
                    progressPercentage={occupancyRate}
                    label="Tables occupied"
                  />
                  <MetricCard
                    icon="target"
                    cardBgColor="#EFF6FF"
                    borderColor="#BFDBFE"
                    iconBgColor="#3B82F6"
                    iconColor="#FFFFFF"
                    valueColor="#1E40AF"
                    labelColor="#1D4ED8"
                    badgeLabel={overview?.noShowRateLabel ?? 'Low rate'}
                    badgeVariant="gray"
                    value={overview?.noShowsToday ?? 2}
                    label="No-shows today"
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

              {/* ─── Quick Actions Container ──────────────────────────── */}
              <View style={styles.lightGreenContainer}>
                <View style={styles.containerHeaderRow}>
                  <View style={styles.containerHeaderLeft}>
                    <Text style={styles.containerTitle}>Quick actions</Text>
                  </View>
                </View>

                <View style={styles.quickActionsContainer}>
                  {/* Full-width New Booking card on top */}
                  <Pressable
                    onPress={() => setBookingModalVisible(true)}
                    style={({ pressed }) => [styles.fullWidthNewBookingCard, pressed && styles.actionPressed]}>
                    <View style={styles.newBookingIconRing}>
                      <Icon name="plus" size={22} color="#FFFFFF" />
                    </View>
                    <View style={styles.fullBookingTextCol}>
                      <Text style={styles.newBookingLabel}>New booking</Text>
                      <Text style={styles.newBookingSub}>Reserve table</Text>
                    </View>
                  </Pressable>

                  {/* Bottom 2 side-by-side cards */}
                  <View style={styles.bottomActionsRow}>
                    <Pressable
                      onPress={() => router.push('/(staff)/manager/add-walkin' as never)}
                      style={({ pressed }) => [styles.actionCardHalf, pressed && styles.actionPressed]}>
                      <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                        <Icon name="walk" size={20} color="#D97706" />
                      </View>
                      <View style={styles.actionTextCol}>
                        <Text style={styles.actionCardLabel}>Walk-in</Text>
                        <Text style={styles.actionCardSub}>Add to queue</Text>
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={() => router.push('/(staff)/manager/floor-layout' as never)}
                      style={({ pressed }) => [styles.actionCardHalf, pressed && styles.actionPressed]}>
                      <View style={[styles.actionIconCircle, { backgroundColor: '#E0E7FF' }]}>
                        <Icon name="table" size={20} color="#4F46E5" />
                      </View>
                      <View style={styles.actionTextCol}>
                        <Text style={styles.actionCardLabel}>Floor plan</Text>
                        <Text style={styles.actionCardSub}>Manage tables</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* ─── Upcoming Reservations Container ─────────────────── */}
              <View style={styles.lightGreenContainer}>
                <View style={styles.containerHeaderRow}>
                  <View style={styles.containerHeaderLeft}>
                    <Text style={styles.containerTitle}>Upcoming</Text>
                    <View style={styles.sectionCountBadge}>
                      <Text style={styles.sectionCountText}>
                        {reservations.filter((r) => r.status !== 'cancelled').length}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => router.push('/(staff)/manager/explore' as never)}
                    style={({ pressed }) => [styles.seeAllBtn, pressed && styles.actionPressed]}>
                    <Text style={styles.seeAllText}>See All</Text>
                    <Icon name="chevron-right" size={14} color="#009669" />
                  </Pressable>
                </View>

                <View style={styles.timelineContainer}>
                  {reservations.filter((r) => r.status !== 'cancelled').length === 0 ? (
                    <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, color: '#333a49ff', fontStyle: 'italic' }}>
                        No upcoming reservations scheduled.
                      </Text>
                    </View>
                  ) : (
                    reservations
                      .filter((r) => r.status !== 'cancelled')
                      .slice(0, 5)
                      .map((res, idx, arr) => (
                        <Pressable
                          key={res.id}
                          onPress={() =>
                            router.push({
                              pathname: '/(staff)/manager/reservation-detail',
                              params: {
                                id: res.id,
                                bookingId: res.bookingId || res.id,
                                guestName: res.guestName,
                                time: res.time,
                                date: res.date || 'Today',
                                partySize: `${res.partySize} Guests`,
                                tableNumber: res.tableNumber || 'Unassigned',
                                tableArea: res.tableArea || 'Main Room',
                                phone: res.phone || '',
                                notes: res.notes || '',
                                status: res.status,
                                avatarUrl: res.avatarUrl || '',
                              },
                            })
                          }
                          style={({ pressed }) => [
                            styles.timelineItem,
                            idx === arr.length - 1 && styles.timelineItemLast,
                            pressed && styles.actionPressed,
                          ]}>
                          {/* Timeline dot & line */}
                          <View style={styles.timelineDotCol}>
                            <View
                              style={[
                                styles.timelineDot,
                                res.status === 'pending' && styles.timelineDotPending,
                              ]}
                            />
                            {idx < arr.length - 1 && <View style={styles.timelineLine} />}
                          </View>

                          {/* Card content */}
                          <View style={styles.timelineCard}>
                            <View style={styles.timelineCardTop}>
                              <View style={styles.timelineNameRow}>
                                <Text style={styles.timelineGuestName}>{res.guestName}</Text>
                                {res.vipBadge && (
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
                                <Icon name="users" size={12} color="#030914ff" />
                                <Text style={styles.timelineMetaText}>{res.partySize} guests</Text>
                              </View>
                              <View style={styles.timelineMetaItem}>
                                <Icon name="grid" size={12} color="#080b12ff" />
                                <Text style={styles.timelineMetaText}>
                                  {res.tableNumber || 'Unassigned'}
                                </Text>
                              </View>
                              <StatusBadge
                                label={
                                  res.status === 'confirmed'
                                    ? 'Confirmed'
                                    : res.status === 'seated'
                                      ? 'Seated'
                                      : 'Pending'
                                }
                                variant={
                                  res.status === 'confirmed'
                                    ? 'green'
                                    : res.status === 'seated'
                                      ? 'teal'
                                      : 'amber'
                                }
                              />
                            </View>
                          </View>
                        </Pressable>
                      ))
                  )}
                </View>
              </View>

              {/* ─── Manager Tools Container ─────────────────────────── */}
              <View style={styles.lightGreenContainer}>
                <View style={styles.containerHeaderRow}>
                  <Text style={styles.containerTitle}>Manager Tools</Text>
                  <Pressable
                    onPress={() => router.push('/(staff)/manager/profile' as never)}
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
                    onPress={() => router.push('/(staff)/manager/admin-dashboard' as never)}
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
                    onPress={() => router.push('/(staff)/manager/restaurant-settings' as never)}
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
                    onPress={() => router.push('/(staff)/manager/tables' as never)}
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
                    onPress={() => router.push('/(staff)/manager/reports' as never)}
                  />
                </View>
              </View>

              {/* Bottom spacer */}
              <View style={{ height: 8 }} />
            </>
          )}
        </ScrollView>

        {/* ─── Bottom Navigation Bar ─────────────────────────────── */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          waitlistCount={overview?.guestsInQueue ?? 0}
          alertsCount={unreadNotificationsCount}
        />
      </View>

      {/* ─── New Booking Modal ──────────────────────────────────── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Reservation</Text>
              <Pressable
                onPress={() => setBookingModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Input
              label="Guest Name"
              placeholder="e.g. William Clark"
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
                  label="Time Slot"
                  placeholder="7:30 PM"
                  value={bookingTime}
                  onChangeText={setBookingTime}
                  icon="clock"
                />
              </View>
            </View>

            <Input
              label="Table & Area"
              placeholder="Table 5 (Dining)"
              value={tableNumber}
              onChangeText={setTableNumber}
              icon="table"
            />

            <Input
              label="Special Notes / VIP"
              placeholder="Window seat, Anniversary, Allergies..."
              value={bookingNotes}
              onChangeText={setBookingNotes}
            />

            <View style={styles.modalActions}>
              <Button
                label="Cancel"
                variant="white"
                onPress={() => setBookingModalVisible(false)}
                style={styles.modalActionBtn}
              />
              <Button
                label="Confirm Booking"
                variant="primary"
                onPress={handleCreateBooking}
                style={styles.modalActionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Walk-in Registration Modal ─────────────────────────── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={walkInModalVisible}
        onRequestClose={() => setWalkInModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Walk-in Party</Text>
              <Pressable
                onPress={() => setWalkInModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Input
              label="Guest Name"
              placeholder="e.g. Miller Party"
              value={walkInName}
              onChangeText={setWalkInName}
              icon="person"
            />

            <View style={styles.modalRow}>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Party Size"
                  placeholder="4"
                  keyboardType="numeric"
                  value={walkInSize}
                  onChangeText={setWalkInSize}
                  icon="users"
                />
              </View>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Phone Number"
                  placeholder="(555) 019-2834"
                  keyboardType="phone-pad"
                  value={walkInPhone}
                  onChangeText={setWalkInPhone}
                  icon="phone"
                />
              </View>
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

      {/* ─── Rush Alert Details Modal ───────────────────────────── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={rushModalVisible}
        onRequestClose={() => setRushModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rush Hour Preparation</Text>
              <Pressable onPress={() => setRushModalVisible(false)}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <Text style={styles.rushModalSub}>
              Heavy guest volume expected at {overview?.rushAlert?.time ?? '7:30 PM'}.
            </Text>
            <View style={styles.rushInfoBox}>
              <Text style={styles.rushInfoTitle}>Recommended Host Actions:</Text>
              <Text style={styles.rushInfoBullet}>• Pre-assign 4-top tables in Main Room</Text>
              <Text style={styles.rushInfoBullet}>• Notify kitchen of 18 covers arriving within 45m</Text>
              <Text style={styles.rushInfoBullet}>• Prepare waitlist SMS notifications</Text>
            </View>
            <Button
              label="Acknowledge & Close"
              variant="primary"
              onPress={() => setRushModalVisible(false)}
              style={{ marginTop: 12 }}
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
    backgroundColor: '#022C22',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingBottom: 16,
    gap: 8,
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    marginHorizontal: -18,
    marginBottom: 16,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  serviceIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    flexShrink: 0,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  clockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#009669',
    borderWidth: 1.8,
    borderColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // ── Hero Section (Combined #022C22 Dark Emerald Container) ───
  heroSection: {
    backgroundColor: '#022C22',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
    marginHorizontal: -16,
    marginTop: -8,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(52, 211, 153, 0.22)',
    borderTopWidth: 0,
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.42,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlowTopRight: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#059669',
    opacity: 0.24,
  },
  heroGlowBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -50,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#34D399',
    opacity: 0.12,
  },
  heroGlowCenter: {
    position: 'absolute',
    top: 40,
    left: 70,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0284C7',
    opacity: 0.08,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  greetingName: {
    color: '#34D399',
  },
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A7F3D0',
    lineHeight: 21,
    marginBottom: 22,
  },

  // Shift progress (Inside #022C22 container)
  shiftProgressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
  },
  shiftProgressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressCircleBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#34D399',
  },
  shiftProgressTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  shiftProgressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  shiftProgressValue: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#A7F3D0',
  },
  shiftProgressTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  shiftProgressFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 4,
  },

  // ── Metrics Grid ─────────────────────────────────
  metricsGrid: {
    gap: 8,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kitchenBoard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  kitchenLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  kitchenBoardSubtitle: {
    color: '#4B6357',
    fontSize: 13,
    marginBottom: 10,
  },
  kitchenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    gap: 10,
  },
  kitchenTime: {
    width: 66,
  },
  kitchenTimeText: {
    color: '#14532D',
    fontSize: 13,
    fontWeight: '800',
  },
  kitchenPartyText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  kitchenGuest: {
    flex: 1,
  },
  kitchenGuestName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  kitchenTable: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  kitchenStatus: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
    maxWidth: 82,
    textAlign: 'right',
  },
  kitchenEmpty: {
    color: '#64748B',
    fontSize: 13,
    paddingVertical: 8,
  },
  kitchenMore: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
    paddingTop: 8,
  },

  // ── Light Touch Containers ─────────────────
  lightGreenContainer: {
    backgroundColor: '#d0dbb8ff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  containerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  containerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  containerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },

  // ── Quick Actions ────────────────────────────────
  quickActionsContainer: {
    gap: 10,
    marginTop: 4,
  },
  fullWidthNewBookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009669',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '55%',
    alignSelf: 'center',
    borderWidth: 1.2,
    borderColor: '#059669',
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomColor: '#064E3B',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    gap: 14,
  },
  fullBookingTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionCardHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#94A3B8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    gap: 10,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  actionCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionCardSub: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#64748B',
  },
  newBookingIconRing: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  newBookingLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  newBookingSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '400',
  },
  actionPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.975 }],
  },

  // ── Section Blocks ───────────────────────────────
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#94A3B8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
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

  // ── Manager Tools ────────────────────────────────
  toolsCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 6,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#94A3B8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  // ── Modals ───────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalHalfCol: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalActionBtn: {
    flex: 1,
  },
  rushModalSub: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  rushInfoBox: {
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
    marginBottom: 12,
  },
  rushInfoTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  rushInfoBullet: {
    fontSize: 12.5,
    color: '#B91C1C',
  },
});
