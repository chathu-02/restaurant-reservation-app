import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';

interface DaySchedule {
  day: string;
  timeRange: string;
  isOpen: boolean;
  isHighlight?: boolean;
}

interface BlackoutDate {
  id: string;
  dateStr: string;
  badgeLabel: string;
  title: string;
  color: string;
}

export default function RestaurantSettingsScreen() {
  const router = useRouter();

  // Weekly hours state
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Mon', timeRange: '11:00 AM – 10:00 PM', isOpen: true },
    { day: 'Tue', timeRange: '11:00 AM – 10:00 PM', isOpen: true },
    { day: 'Wed', timeRange: '11:00 AM – 10:00 PM', isOpen: true },
    { day: 'Thu', timeRange: '11:00 AM – 10:00 PM', isOpen: true },
    { day: 'Fri', timeRange: '11:00 AM – 11:30 PM', isOpen: true, isHighlight: true },
    { day: 'Sat', timeRange: '10:00 AM – 11:30 PM', isOpen: true, isHighlight: true },
    { day: 'Sun', timeRange: 'Closed for Diners', isOpen: false },
  ]);

  // Booking Interval state (15, 30, 60)
  const [interval, setInterval] = useState<number>(30);

  // Max Party Size state
  const [maxPartySize, setMaxPartySize] = useState<number>(12);

  // Blackout dates state
  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>([
    {
      id: 'bd1',
      dateStr: 'Dec 25, 2024',
      badgeLabel: 'Holiday',
      title: 'Christmas Day • Full Day Closure',
      color: '#EF4444',
    },
    {
      id: 'bd2',
      dateStr: 'Jan 1, 2025',
      badgeLabel: 'Holiday',
      title: "New Year's Day • Full Day Closure",
      color: '#F59E0B',
    },
  ]);

  // Add Blackout Date Modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDateStr, setNewDateStr] = useState('');
  const [newTitleStr, setNewTitleStr] = useState('');

  // Toggle day status
  const handleToggleDay = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  // Sync Mon-Thu
  const handleSyncMonThu = () => {
    const monSchedule = schedule.find((s) => s.day === 'Mon')?.timeRange || '11:00 AM – 10:00 PM';
    setSchedule((prev) =>
      prev.map((item) =>
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(item.day)
          ? { ...item, timeRange: monSchedule, isOpen: true }
          : item
      )
    );
    Alert.alert('Weekdays Synced', `Set Mon-Fri operating hours to: ${monSchedule}`);
  };

  // Remove Blackout Date
  const handleRemoveBlackout = (id: string) => {
    setBlackoutDates((prev) => prev.filter((b) => b.id !== id));
  };

  // Add new blackout date
  const handleAddBlackout = () => {
    if (!newDateStr.trim()) {
      Alert.alert('Required', 'Please enter date (e.g. Jul 4, 2025)');
      return;
    }
    const newEntry: BlackoutDate = {
      id: `bd-${Date.now()}`,
      dateStr: newDateStr.trim(),
      badgeLabel: 'Blackout',
      title: newTitleStr.trim() || 'Private Event / Maintenance',
      color: '#EF4444',
    };
    setBlackoutDates((prev) => [...prev, newEntry]);
    setNewDateStr('');
    setNewTitleStr('');
    setAddModalVisible(false);
    Alert.alert('Blackout Date Added', `Closure added for ${newEntry.dateStr}`);
  };

  // Save all changes
  const handleSaveChanges = () => {
    Alert.alert(
      'Settings Saved ✓',
      'Operating schedule, interval & max party capacity updated successfully.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const openCount = schedule.filter((s) => s.isOpen).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9EC" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={20} color="#0F172A" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Restaurant Settings</Text>
              <View style={styles.greenStatusDot} />
            </View>
            <Text style={styles.headerSubtitle}>TACKE BISTRO • DOWNTOWN</Text>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                'Help & Guidance',
                'Adjust operating hours, max capacity, reservation slots, and blackout dates. Changes reflect immediately on booking widgets.'
              )
            }
            style={({ pressed }) => [styles.helpBtn, pressed && styles.pressed]}>
            <Icon name="help-circle" size={20} color="#64748B" />
          </Pressable>
        </View>

        <Text style={styles.pageDescription}>
          Manage daily operating schedule, guest booking capacity, and reservation slot intervals.
        </Text>

        {/* Scrollable Form Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* SECTION 1: Weekly Operating Hours */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBadge, { backgroundColor: '#E6F8F0' }]}>
                  <Icon name="clock" size={18} color="#009669" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Weekly Operating Hours</Text>
                  <Text style={styles.cardSub}>Standard dine-in table times</Text>
                </View>
              </View>

              <View style={styles.cardHeaderRight}>
                <View style={styles.openBadge}>
                  <Text style={styles.openBadgeText}>{openCount} Open</Text>
                </View>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Presets',
                      'Select Preset Schedule:\n• Standard (11AM-10PM)\n• Late Night Weekend (11AM-11:30PM)\n• Dinner Only (5PM-11PM)'
                    )
                  }
                  style={({ pressed }) => [styles.presetBtn, pressed && styles.pressed]}>
                  <Icon name="flash" size={13} color="#00875A" />
                  <Text style={styles.presetText}>Presets</Text>
                </Pressable>
              </View>
            </View>

            {/* Daily Schedule Rows */}
            <View style={styles.scheduleList}>
              {schedule.map((item) => (
                <View
                  key={item.day}
                  style={[
                    styles.dayRow,
                    item.isHighlight && styles.dayRowHighlight,
                    !item.isOpen && styles.dayRowClosed,
                  ]}>
                  <View style={styles.dayLeftCol}>
                    <Text
                      style={[
                        styles.dayLabel,
                        item.isHighlight && styles.dayLabelHighlight,
                        !item.isOpen && styles.dayLabelClosed,
                      ]}>
                      {item.day}
                    </Text>
                    {item.isHighlight && <View style={styles.greenHighlightDot} />}
                  </View>

                  <View style={styles.timeDropdown}>
                    <Text
                      style={[
                        styles.timeDropdownText,
                        !item.isOpen && styles.timeDropdownTextClosed,
                      ]}>
                      {item.isOpen ? item.timeRange : 'Closed for Diners'}
                    </Text>
                    {item.isOpen && <Icon name="chevron-right" size={14} color="#64748B" />}
                  </View>

                  <Switch
                    value={item.isOpen}
                    onValueChange={() => handleToggleDay(item.day)}
                    trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
                    thumbColor={item.isOpen ? '#009669' : '#F1F5F9'}
                  />
                </View>
              ))}
            </View>

            {/* Sync Mon-Thu footer link */}
            <View style={styles.scheduleFooter}>
              <Pressable
                onPress={handleSyncMonThu}
                style={({ pressed }) => [styles.syncBtn, pressed && styles.pressed]}>
                <Icon name="refresh" size={14} color="#009669" />
                <Text style={styles.syncText}>Sync Mon–Thu to all weekdays</Text>
              </Pressable>

              <Text style={styles.timezoneText}>Time zone: EST (UTC-5)</Text>
            </View>
          </View>

          {/* SECTION 2: Booking Intervals */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBadge, { backgroundColor: '#EFF6FF' }]}>
                  <Icon name="clock" size={18} color="#2563EB" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Booking Intervals</Text>
                  <Text style={styles.cardSub}>Available start-time increments on booking widget</Text>
                </View>
              </View>

              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            </View>

            {/* Segmented Selector */}
            <View style={styles.segmentedContainer}>
              {[15, 30, 60].map((mins) => {
                const isSelected = interval === mins;
                return (
                  <Pressable
                    key={mins}
                    onPress={() => setInterval(mins)}
                    style={[
                      styles.segmentItem,
                      isSelected && styles.segmentActive,
                    ]}>
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.segmentTextActive,
                      ]}>
                      {isSelected ? `✓ ${mins} min` : `${mins} min`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* SECTION 3: Max Party Size */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Icon name="users" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Max Party Size</Text>
                  <Text style={styles.cardSub}>Guests allowed per instant reservation</Text>
                </View>
              </View>

              <View style={styles.instantBadge}>
                <Text style={styles.instantText}>Instant</Text>
              </View>
            </View>

            {/* Counter controls */}
            <View style={styles.counterRow}>
              <Text style={styles.counterHelpText}>
                Large groups exceeding {maxPartySize} guests require direct phone inquiry.
              </Text>

              <View style={styles.counterControls}>
                <Pressable
                  onPress={() => setMaxPartySize((prev) => Math.max(1, prev - 1))}
                  style={({ pressed }) => [styles.counterBtn, pressed && styles.pressed]}>
                  <Text style={styles.counterBtnMinus}>−</Text>
                </Pressable>

                <View style={styles.counterValueBox}>
                  <Text style={styles.counterValueText}>{maxPartySize}</Text>
                </View>

                <Pressable
                  onPress={() => setMaxPartySize((prev) => prev + 1)}
                  style={({ pressed }) => [styles.counterBtnPlus, pressed && styles.pressed]}>
                  <Text style={styles.counterBtnPlusText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* SECTION 4: Closed Dates & Holidays */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBadge, { backgroundColor: '#FFE4E6' }]}>
                  <Icon name="calendar" size={18} color="#EF4444" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Closed Dates & Holidays</Text>
                  <Text style={styles.cardSub}>Blackout schedule for 2024–2025</Text>
                </View>
              </View>

              <View style={styles.activeBlackoutsBadge}>
                <Text style={styles.activeBlackoutsText}>{blackoutDates.length} Active</Text>
              </View>
            </View>

            {/* Blackout dates list */}
            <View style={styles.blackoutList}>
              {blackoutDates.map((item) => (
                <View key={item.id} style={styles.blackoutCard}>
                  <View style={[styles.blackoutDot, { backgroundColor: item.color }]} />

                  <View style={styles.blackoutContent}>
                    <View style={styles.blackoutTitleRow}>
                      <Text style={styles.blackoutDateText}>{item.dateStr}</Text>
                      <View style={styles.holidayPill}>
                        <Text style={styles.holidayPillText}>{item.badgeLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.blackoutSubText}>{item.title}</Text>
                  </View>

                  <Pressable
                    onPress={() => handleRemoveBlackout(item.id)}
                    style={({ pressed }) => [styles.removeBlackoutBtn, pressed && styles.pressed]}>
                    <Icon name="close" size={14} color="#94A3B8" />
                  </Pressable>
                </View>
              ))}

              {/* Add Blackout Date Button */}
              <Pressable
                onPress={() => setAddModalVisible(true)}
                style={({ pressed }) => [styles.addBlackoutBtn, pressed && styles.pressed]}>
                <Icon name="plus" size={15} color="#DC2626" />
                <Text style={styles.addBlackoutText}>Add Blackout Date</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Footer Bar */}
        <View style={styles.footerBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.discardBtn, pressed && styles.pressed]}>
            <Text style={styles.discardText}>Discard</Text>
          </Pressable>

          <Pressable
            onPress={handleSaveChanges}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
            <Text style={styles.saveText}>Save Changes</Text>
            <Icon name="check" size={17} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Add Blackout Date Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Blackout Date</Text>
              <Pressable onPress={() => setAddModalVisible(false)}>
                <Icon name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Date (e.g. Jul 4, 2025)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Jul 4, 2025"
              value={newDateStr}
              onChangeText={setNewDateStr}
            />

            <Text style={styles.inputLabel}>Reason / Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Independence Day • Full Day Closure"
              value={newTitleStr}
              onChangeText={setNewTitleStr}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setAddModalVisible(false)}
                style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleAddBlackout}
                style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmText}>Confirm Blackout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9EC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F9EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1.5,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  greenStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  helpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1.5,
  },
  pageDescription: {
    fontSize: 12.5,
    color: '#64748B',
    paddingHorizontal: 18,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 17,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openBadge: {
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  openBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
  },
  scheduleList: {
    gap: 6,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dayRowHighlight: {
    backgroundColor: '#E6F8F0',
    borderColor: '#A7F3D0',
  },
  dayRowClosed: {
    backgroundColor: '#F8FAFC',
    opacity: 0.7,
  },
  dayLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 44,
  },
  dayLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  dayLabelHighlight: {
    color: '#00875A',
    fontWeight: '800',
  },
  dayLabelClosed: {
    color: '#94A3B8',
  },
  greenHighlightDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  timeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  timeDropdownText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  timeDropdownTextClosed: {
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  scheduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  timezoneText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  recommendedBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    marginTop: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  segmentActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  instantBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  instantText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 12,
  },
  counterHelpText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 16,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnMinus: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
  },
  counterValueBox: {
    minWidth: 36,
    alignItems: 'center',
  },
  counterValueText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  counterBtnPlus: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  counterBtnPlusText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activeBlackoutsBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  activeBlackoutsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE123C',
  },
  blackoutList: {
    gap: 8,
    marginTop: 4,
  },
  blackoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    gap: 10,
  },
  blackoutDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  blackoutContent: {
    flex: 1,
  },
  blackoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blackoutDateText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  holidayPill: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  holidayPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BE123C',
  },
  blackoutSubText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  removeBlackoutBtn: {
    padding: 4,
  },
  addBlackoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: '#FECDD3',
    borderStyle: 'dashed',
    gap: 6,
    marginTop: 4,
  },
  addBlackoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  discardBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  discardText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#34D399',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
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
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
