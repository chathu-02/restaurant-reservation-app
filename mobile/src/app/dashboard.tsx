import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../components/ui/Icon';

const staffAvatarImg = require('../../assets/images/staff_avatar.jpg');

export default function StaffDashboardScreen() {
  const router = useRouter();

  // Metrics state
  const [metrics, setMetrics] = useState({
    reservationsToday: 24,
    reservationsChange: '+12%',
    guestsInQueue: 6,
    queueWaitTime: '18 min wait',
    tablesOccupied: 12,
    tablesTotal: 20,
    noShows: 2,
    noShowsLevel: 'Low (4%)',
  });

  // Modals state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isRushSlotsModalOpen, setIsRushSlotsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Form states for modals
  const [walkInName, setWalkInName] = useState('');
  const [walkInParty, setWalkInParty] = useState('2');
  const [walkInPhone, setWalkInPhone] = useState('');

  const [bookingName, setBookingName] = useState('');
  const [bookingTime, setBookingTime] = useState('19:30');
  const [bookingParty, setBookingParty] = useState('4');

  const handleAddWalkIn = () => {
    if (!walkInName.trim()) {
      Alert.alert('Required', 'Please enter guest name');
      return;
    }
    setMetrics((prev) => ({
      ...prev,
      guestsInQueue: prev.guestsInQueue + 1,
    }));
    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    Alert.alert('Added', 'Walk-in guest added to queue successfully!');
  };

  const handleCreateBooking = () => {
    if (!bookingName.trim()) {
      Alert.alert('Required', 'Please enter primary guest name');
      return;
    }
    setMetrics((prev) => ({
      ...prev,
      reservationsToday: prev.reservationsToday + 1,
    }));
    setIsNewBookingModalOpen(false);
    setBookingName('');
    Alert.alert('Confirmed', 'New reservation confirmed for ' + bookingTime);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          {/* Dinner Service Pill */}
          <View style={styles.shiftPill}>
            <View style={styles.blinkingDot} />
            <Text style={styles.shiftPillText}>Dinner Service</Text>
            <Text style={styles.shiftSubtitle}> • Shift 2</Text>
          </View>

          {/* Avatar with Status Dot */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push('/staff-profile')}
            activeOpacity={0.7}
          >
            <Image source={staffAvatarImg} style={styles.avatarImage} />
            <View style={styles.avatarOnlineDot} />
          </TouchableOpacity>
        </View>

        {/* Date & Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>Today</Text>
          <Text style={styles.dateText}>Friday, Oct 24, 2026</Text>
        </View>

        {/* 2x2 Metric Cards Grid */}
        <View style={styles.gridContainer}>
          {/* Card 1: Reservations Today */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => setIsNewBookingModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#E8FAF0' }]}>
                <Icon name="calendar" size={18} color="#009669" />
              </View>
              <View style={[styles.badgePill, { backgroundColor: '#E8FAF0' }]}>
                <Text style={[styles.badgePillText, { color: '#00875A' }]}>
                  {metrics.reservationsChange}
                </Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.reservationsToday}</Text>
            <Text style={styles.metricLabel}>Reservations today</Text>
          </TouchableOpacity>

          {/* Card 2: Guests in queue */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => setIsWalkInModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#EEF2FF' }]}>
                <Icon name="users" size={18} color="#6366F1" />
              </View>
              <View style={[styles.badgePill, { backgroundColor: '#F3F4F6' }]}>
                <Text style={[styles.badgePillText, { color: '#4B5563' }]}>
                  {metrics.queueWaitTime}
                </Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.guestsInQueue}</Text>
            <Text style={styles.metricLabel}>Guests in queue</Text>
          </TouchableOpacity>

          {/* Card 3: Tables occupied */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => Alert.alert('Zone A Capacity', '12 out of 20 tables currently occupied with 75 min turn pace.')}
            activeOpacity={0.8}
          >
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#FFF7ED' }]}>
                <Icon name="grid" size={18} color="#EA580C" />
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.round(
                        (metrics.tablesOccupied / metrics.tablesTotal) * 100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.occupiedRow}>
              <Text style={styles.metricValue}>{metrics.tablesOccupied}</Text>
              <Text style={styles.metricTotalSlash}>/{metrics.tablesTotal}</Text>
            </View>
            <Text style={styles.metricLabel}>Tables occupied</Text>
          </TouchableOpacity>

          {/* Card 4: No-shows */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#FEF2F2' }]}>
                <Icon name="x-circle" size={18} color="#EF4444" />
              </View>
              <View style={[styles.badgePill, { backgroundColor: '#E8FAF0' }]}>
                <Text style={[styles.badgePillText, { color: '#00875A' }]}>
                  {metrics.noShowsLevel}
                </Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.noShows}</Text>
            <Text style={styles.metricLabel}>No-shows</Text>
          </View>
        </View>

        {/* Rush Alert Banner Card */}
        <View style={styles.rushCard}>
          <View style={styles.rushCardTop}>
            <View style={styles.rushIconBox}>
              <Icon name="zap" size={18} color="#EA580C" />
            </View>
            <View style={styles.rushTextContent}>
              <Text style={styles.rushCardTitle}>Dinner rush forecast • Peak 7:30 PM</Text>
              <Text style={styles.rushCardSub}>85% reserved (38 covers expected)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.rushSlotButton}
            onPress={() => setIsRushSlotsModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.rushSlotButtonText}>View Rush Slots</Text>
            <Icon name="chevron-right" size={14} color="#EA580C" />
          </TouchableOpacity>
        </View>

        {/* 3 Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => setIsWalkInModalOpen(true)}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnPrimaryText}>Walk-in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => setIsNewBookingModalOpen(true)}
            activeOpacity={0.8}
          >
            <Icon name="calendar" size={16} color="#111827" />
            <Text style={styles.actionBtnSecondaryText}>New Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => setIsManageModalOpen(true)}
            activeOpacity={0.8}
          >
            <Icon name="gear" size={16} color="#111827" />
            <Text style={styles.actionBtnSecondaryText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Manager Tools Section */}
        <View style={styles.managerSection}>
          <Text style={styles.sectionHeaderTitle}>MANAGER TOOLS</Text>

          <View style={styles.managerToolsCard}>
            {/* 1. Staff Accounts */}
            <TouchableOpacity
              style={styles.managerRow}
              onPress={() => router.push('/staff-accounts')}
              activeOpacity={0.7}
            >
              <View style={[styles.managerIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Icon name="users" size={18} color="#6366F1" />
              </View>
              <View style={styles.managerRowInfo}>
                <Text style={styles.managerRowTitle}>Staff Accounts</Text>
                <Text style={styles.managerRowSubtitle}>
                  View roster & roles (4 team members)
                </Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* 2. Table Layout */}
            <TouchableOpacity
              style={styles.managerRow}
              onPress={() => Alert.alert('Floor Layout', 'Zone A Dining Room: 20 Tables (12 Seated, 8 Open).')}
              activeOpacity={0.7}
            >
              <View style={[styles.managerIconCircle, { backgroundColor: '#E8FAF0' }]}>
                <Icon name="table" size={18} color="#009669" />
              </View>
              <View style={styles.managerRowInfo}>
                <Text style={styles.managerRowTitle}>Table Layout</Text>
                <Text style={styles.managerRowSubtitle}>
                  Zone A active • 20 dining tables
                </Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* 3. Settings */}
            <TouchableOpacity
              style={styles.managerRow}
              onPress={() => setIsSettingsModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.managerIconCircle, { backgroundColor: '#F3F4F6' }]}>
                <Icon name="gear" size={18} color="#4B5563" />
              </View>
              <View style={styles.managerRowInfo}>
                <Text style={styles.managerRowTitle}>Restaurant Settings</Text>
                <Text style={styles.managerRowSubtitle}>
                  Operating hours & table turnaround
                </Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 5-Tab Staff Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navTabActive} activeOpacity={0.8}>
          <Icon name="grid" size={20} color="#00B37E" />
          <Text style={styles.navTabLabelActive}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/join-queue')}
          activeOpacity={0.7}
        >
          <Icon name="calendar" size={20} color="#9CA3AF" />
          <Text style={styles.navTabLabel}>Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/queue')}
          activeOpacity={0.7}
        >
          <Icon name="users" size={20} color="#9CA3AF" />
          <Text style={styles.navTabLabel}>Queue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/staff-accounts')}
          activeOpacity={0.7}
        >
          <Icon name="armchair" size={20} color="#9CA3AF" />
          <Text style={styles.navTabLabel}>Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/staff-profile')}
          activeOpacity={0.7}
        >
          <Icon name="person" size={20} color="#9CA3AF" />
          <Text style={styles.navTabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Walk-in Modal */}
      <Modal
        visible={isWalkInModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsWalkInModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Walk-in Guest</Text>
              <TouchableOpacity onPress={() => setIsWalkInModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Guest Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. David Miller"
                placeholderTextColor="#9CA3AF"
                value={walkInName}
                onChangeText={setWalkInName}
              />

              <Text style={styles.fieldLabel}>Party Size</Text>
              <View style={styles.partySelectRow}>
                {['1', '2', '4', '6', '8+'].map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    style={[
                      styles.partyPill,
                      walkInParty === sz && styles.partyPillActive,
                    ]}
                    onPress={() => setWalkInParty(sz)}
                  >
                    <Text
                      style={[
                        styles.partyPillText,
                        walkInParty === sz && styles.partyPillTextActive,
                      ]}
                    >
                      {sz}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Phone (Optional for SMS)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+1 (555) 019-2831"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={walkInPhone}
                onChangeText={setWalkInPhone}
              />

              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleAddWalkIn}
                activeOpacity={0.8}
              >
                <Text style={styles.submitModalBtnText}>Add to Queue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Booking Modal */}
      <Modal
        visible={isNewBookingModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsNewBookingModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Reservation</Text>
              <TouchableOpacity onPress={() => setIsNewBookingModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Guest Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Sarah Jenkins"
                placeholderTextColor="#9CA3AF"
                value={bookingName}
                onChangeText={setBookingName}
              />

              <Text style={styles.fieldLabel}>Time Slot</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="19:30"
                placeholderTextColor="#9CA3AF"
                value={bookingTime}
                onChangeText={setBookingTime}
              />

              <Text style={styles.fieldLabel}>Party Size</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="4"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={bookingParty}
                onChangeText={setBookingParty}
              />

              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleCreateBooking}
                activeOpacity={0.8}
              >
                <Text style={styles.submitModalBtnText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rush Slots Modal */}
      <Modal
        visible={isRushSlotsModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsRushSlotsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dinner Rush Forecast</Text>
              <TouchableOpacity onPress={() => setIsRushSlotsModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.rushSlotDesc}>
              Peak arrival density between 7:00 PM and 8:30 PM.
            </Text>

            <View style={styles.slotRow}>
              <Text style={styles.slotTime}>7:00 PM</Text>
              <Text style={styles.slotCovers}>14 covers (80% full)</Text>
            </View>
            <View style={styles.slotRow}>
              <Text style={styles.slotTime}>7:30 PM (Peak)</Text>
              <Text style={[styles.slotCovers, { color: '#EA580C', fontWeight: '800' }]}>
                24 covers (95% full)
              </Text>
            </View>
            <View style={styles.slotRow}>
              <Text style={styles.slotTime}>8:00 PM</Text>
              <Text style={styles.slotCovers}>12 covers (70% full)</Text>
            </View>

            <TouchableOpacity
              style={styles.submitModalBtn}
              onPress={() => setIsRushSlotsModalOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.submitModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Manage Shift Modal */}
      <Modal
        visible={isManageModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsManageModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shift Management</Text>
              <TouchableOpacity onPress={() => setIsManageModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.manageOptionCard}
              onPress={() => {
                setIsManageModalOpen(false);
                router.push('/staff-accounts');
              }}
            >
              <Icon name="users" size={20} color="#111827" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.manageOptionTitle}>Manage Staff Roster</Text>
                <Text style={styles.manageOptionSub}>Edit duty status and add staff</Text>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.manageOptionCard}
              onPress={() => {
                setIsManageModalOpen(false);
                setIsRushSlotsModalOpen(true);
              }}
            >
              <Icon name="clock" size={20} color="#111827" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.manageOptionTitle}>Table Capacity Forecast</Text>
                <Text style={styles.manageOptionSub}>Review peak rush arrival slots</Text>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitModalBtn}
              onPress={() => setIsManageModalOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.submitModalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Restaurant Settings Modal */}
      <Modal
        visible={isSettingsModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSettingsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restaurant Settings</Text>
              <TouchableOpacity onPress={() => setIsSettingsModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItemBox}>
              <Text style={styles.settingItemTitle}>Dinner Service Window:</Text>
              <Text style={styles.settingItemVal}>5:30 PM - 11:00 PM</Text>
            </View>

            <View style={styles.settingItemBox}>
              <Text style={styles.settingItemTitle}>Standard Table Turnaround:</Text>
              <Text style={styles.settingItemVal}>75 minutes</Text>
            </View>

            <View style={styles.settingItemBox}>
              <Text style={styles.settingItemTitle}>Grace Period for No-shows:</Text>
              <Text style={styles.settingItemVal}>15 minutes</Text>
            </View>

            <TouchableOpacity
              style={styles.submitModalBtn}
              onPress={() => setIsSettingsModalOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.submitModalBtnText}>Close Settings</Text>
            </TouchableOpacity>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shiftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FAF0',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  blinkingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
    marginRight: 6,
  },
  shiftPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  shiftSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#00B37E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  titleSection: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  progressBarTrack: {
    width: 48,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  occupiedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricTotalSlash: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  rushCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  rushCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rushIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rushTextContent: {
    flex: 1,
  },
  rushCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  rushCardSub: {
    fontSize: 11,
    color: '#9A3412',
    marginTop: 2,
  },
  rushSlotButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  rushSlotButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EA580C',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#181A1E',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  managerSection: {
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  managerToolsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  managerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  managerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  managerRowInfo: {
    flex: 1,
  },
  managerRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  managerRowSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
  },
  navTab: {
    alignItems: 'center',
    gap: 2,
  },
  navTabActive: {
    alignItems: 'center',
    gap: 2,
  },
  navTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  navTabLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00B37E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  modalForm: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  partySelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  partyPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  partyPillActive: {
    backgroundColor: '#181A1E',
  },
  partyPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  partyPillTextActive: {
    color: '#FFFFFF',
  },
  submitModalBtn: {
    backgroundColor: '#181A1E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  submitModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rushSlotDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  slotTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  slotCovers: {
    fontSize: 12,
    color: '#6B7280',
  },
  manageOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  manageOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  manageOptionSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  settingItemBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  settingItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  settingItemVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
});
