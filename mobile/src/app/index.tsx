import React, { useState } from 'react';
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
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
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

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { overview, refreshing, refresh, addBooking, addWalkIn } = useReservations();

  // Active bottom navigation tab
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Modals for actions
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [walkInModalVisible, setWalkInModalVisible] = useState(false);
  const [rushModalVisible, setRushModalVisible] = useState(false);

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
    if (tab === 'bookings') {
      router.push('/explore');
    } else if (tab === 'waitlist') {
      router.push('/queue');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F8" />
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
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              {/* Green circular/squarish utensil icon */}
              <View style={styles.serviceIconContainer}>
                <Icon name="utensils" size={18} color="#FFFFFF" />
              </View>

              {/* Service Badge */}
              <StatusBadge
                label={overview?.service || user?.service || 'DINNER SERVICE'}
                variant="green"
                dot
                size="medium"
              />
            </View>

            {/* Manager Avatar with online dot */}
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

          {/* Date & Shift Overview Header */}
          <View style={styles.headerSection}>
            <Text style={styles.dateText}>
              {overview?.date || 'WEDNESDAY, JUNE 12'}
            </Text>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>Shift Overview</Text>
              <StatusBadge
                label={overview?.dutyRole || user?.role || 'Shift Lead on Duty'}
                variant="green"
                dot
              />
            </View>
          </View>

          {/* 2x2 Metric Cards Grid */}
          <View style={styles.metricsGrid}>
            {/* Card 1: Reservations Today */}
            <View style={styles.metricsRow}>
              <MetricCard
                icon="calendar"
                iconBgColor="#E6F8F0"
                iconColor="#009669"
                badgeLabel={`+${overview?.newReservations ?? 4} now`}
                badgeVariant="green"
                badgeDot
                value={overview?.reservationsToday ?? 24}
                label="Reservations today"
                onPress={() => router.push('/explore')}
              />

              {/* Card 2: Guests in Queue */}
              <MetricCard
                icon="users"
                iconBgColor="#FEF3C7"
                iconColor="#D97706"
                badgeLabel={`~${overview?.queueWaitMinutes ?? 12} min wait`}
                badgeVariant="amber"
                value={overview?.guestsInQueue ?? 6}
                label="Guests in queue"
                onPress={() => router.push('/queue')}
              />
            </View>

            {/* Card 3: Tables Occupied */}
            <View style={styles.metricsRow}>
              <MetricCard
                icon="grid"
                iconBgColor="#CCFBF1"
                iconColor="#0D9488"
                badgeLabel={`${overview?.tablesOccupancyRate ?? 70}%`}
                badgeVariant="teal"
                value={overview?.occupiedTables ?? 14}
                subValue={`/ ${overview?.totalTables ?? 20}`}
                progressPercentage={overview?.tablesOccupancyRate ?? 70}
                label="Tables occupied"
                onPress={() => router.push('/explore')}
              />

              {/* Card 4: No-shows today */}
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

          {/* Rush Expected Alert Card */}
          <RushAlertCard
            time={overview?.rushAlert?.time ?? '7:30 PM'}
            expectedGuests={overview?.rushAlert?.expectedGuests ?? 18}
            withinMinutes={overview?.rushAlert?.withinMinutes ?? 45}
            onPressView={() => setRushModalVisible(true)}
          />

          {/* 3 Quick Action Buttons */}
          <View style={styles.actionsRow}>
            {/* Walk-in Button */}
            <Pressable
              onPress={() => setWalkInModalVisible(true)}
              style={({ pressed }) => [styles.actionCardButton, pressed && styles.actionPressed]}>
              <Icon name="walk" size={22} color="#4B5563" />
              <Text style={styles.actionCardText}>Walk-in</Text>
            </Pressable>

            {/* New Booking Button (Vibrant Green) */}
            <Pressable
              onPress={() => setBookingModalVisible(true)}
              style={({ pressed }) => [styles.newBookingButton, pressed && styles.actionPressed]}>
              <View style={styles.newBookingIconCircle}>
                <Icon name="plus" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.newBookingText}>New Booking</Text>
            </Pressable>

            {/* Manage Button */}
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [styles.actionCardButton, pressed && styles.actionPressed]}>
              <Icon name="grid" size={20} color="#4B5563" />
              <Text style={styles.actionCardText}>Manage</Text>
            </Pressable>
          </View>

          {/* MANAGER TOOLS Section */}
          <View style={styles.managerToolsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>MANAGER TOOLS</Text>
              <Pressable
                onPress={() => router.push('/profile')}
                style={({ pressed }) => [styles.quickAccessBtn, pressed && styles.actionPressed]}>
                <Text style={styles.quickAccessText}>Quick Access</Text>
                <Icon name="chevron-right" size={14} color="#009669" />
              </Pressable>
            </View>

            {/* Tools Card Container */}
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
                    '8 staff members active: 1 Shift Lead, 1 Host, 4 Servers, 2 Kitchen line.'
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
                onPress={() => router.push('/explore')}
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
                    'Current Table Turn Pace: 1.4x | Projected Covers: 110.'
                  )
                }
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          waitlistCount={overview?.guestsInQueue ?? 4}
        />
      </View>

      {/* New Booking Modal */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBookingModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Reservation</Text>
              <Pressable onPress={() => setBookingModalVisible(false)}>
                <Icon name="close" size={22} color="#6B7280" />
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

      {/* Walk-in Modal */}
      <Modal
        visible={walkInModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setWalkInModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Walk-in to Queue</Text>
              <Pressable onPress={() => setWalkInModalVisible(false)}>
                <Icon name="close" size={22} color="#6B7280" />
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
              <Icon name="clock" size={16} color="#D97706" />
              <Text style={styles.modalInfoText}>
                Estimated wait time: ~12 minutes based on current turn rate.
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

      {/* Rush Details Modal */}
      <Modal
        visible={rushModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRushModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upcoming Dinner Rush</Text>
              <Pressable onPress={() => setRushModalVisible(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </Pressable>
            </View>

            <View style={styles.rushDetailBox}>
              <Text style={styles.rushDetailTime}>Peak: 7:30 PM - 8:15 PM</Text>
              <Text style={styles.rushDetailSummary}>
                18 expected covers arriving across 6 reservations and 2 queue entries.
              </Text>
            </View>

            <View style={styles.rushTipsContainer}>
              <Text style={styles.rushTipTitle}>Recommendations:</Text>
              <Text style={styles.rushTipItem}>• Pre-stage silverware and waters on Tables 4, 7, and 12.</Text>
              <Text style={styles.rushTipItem}>• Inform kitchen lead of 6-top seating at 7:30 PM.</Text>
              <Text style={styles.rushTipItem}>• Maintain bar queue seating for 2-tops.</Text>
            </View>

            <Button
              label="Acknowledge"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
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
  headerSection: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  actionCardButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 6,
  },
  actionCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  newBookingButton: {
    flex: 1.3,
    backgroundColor: '#009669',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 6,
  },
  newBookingIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBookingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  managerToolsSection: {
    marginTop: 4,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
  },
  quickAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  toolsCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
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
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalActionBtn: {
    flex: 1,
  },
  rushDetailBox: {
    backgroundColor: '#FFF9F3',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 12,
  },
  rushDetailTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C2410C',
    marginBottom: 4,
  },
  rushDetailSummary: {
    fontSize: 13,
    color: '#9A3412',
  },
  rushTipsContainer: {
    backgroundColor: '#F8FAF9',
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  rushTipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  rushTipItem: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
});
