import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { BottomNavBar, TabKey } from '@/components/BottomNavBar';

// Types
export type QueueFilter = 'all' | 'inside' | 'patio' | 'large';

interface QueueParty {
  id: string;
  number: number;
  name: string;
  type: 'REMOTE' | 'WALK-IN';
  statusTag?: string;
  statusTagVariant?: 'ready' | 'next' | 'info' | 'birthday';
  guests: number;
  waitTime: string;
  waitType?: 'due' | 'normal';
  prefTags?: string[];
  isFeaturedReady?: boolean;
}

export default function QueueScreen() {
  const router = useRouter();
  const { openModal } = useLocalSearchParams<{ openModal?: string }>();

  // Selected Filter State
  const [activeFilter, setActiveFilter] = useState<QueueFilter>('all');
  const [sortAsc, setSortAsc] = useState(true);

  // Walk-in Modal State
  const [walkInModalVisible, setWalkInModalVisible] = useState(false);

  useEffect(() => {
    if (openModal === 'true') {
      setWalkInModalVisible(true);
    }
  }, [openModal]);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [pref, setPref] = useState<'Inside' | 'Patio' | 'Booth'>('Inside');

  // Interactive Queue Data matching screenshot exactly
  const [queueList, setQueueList] = useState<QueueParty[]>([
    {
      id: 'q-1',
      number: 1,
      name: 'Perera',
      type: 'REMOTE',
      statusTag: 'READY - T-7',
      statusTagVariant: 'ready',
      guests: 4,
      waitTime: '0 min (Due)',
      waitType: 'due',
      prefTags: ['Booth'],
      isFeaturedReady: true,
    },
    {
      id: 'q-2',
      number: 2,
      name: 'Fernando',
      type: 'WALK-IN',
      statusTag: 'Next 5m',
      statusTagVariant: 'next',
      guests: 2,
      waitTime: '5 min wait',
      waitType: 'normal',
      prefTags: ['High-top ok'],
    },
    {
      id: 'q-3',
      number: 3,
      name: 'Silva Family',
      type: 'REMOTE',
      statusTag: 'Party of 6',
      statusTagVariant: 'info',
      guests: 6,
      waitTime: '8 min',
      waitType: 'normal',
      prefTags: ['Highchair req.'],
    },
    {
      id: 'q-4',
      number: 4,
      name: 'Jayasuriya',
      type: 'WALK-IN',
      statusTag: '🎂 Birthday',
      statusTagVariant: 'birthday',
      guests: 3,
      waitTime: '12 min',
      waitType: 'normal',
      prefTags: ['Inside only'],
    },
    {
      id: 'q-5',
      number: 5,
      name: 'De Silva',
      type: 'REMOTE',
      statusTag: '🍃 Patio',
      statusTagVariant: 'info',
      guests: 2,
      waitTime: '15 min',
      waitType: 'normal',
    },
    {
      id: 'q-6',
      number: 6,
      name: 'Wickramasinghe',
      type: 'REMOTE',
      guests: 5,
      waitTime: '22 min',
      waitType: 'normal',
    },
  ]);

  // Featured Ready Party (top highlight card)
  const featuredParty = queueList.find((item) => item.isFeaturedReady) || queueList[0];

  // Filter logic
  const filteredQueue = queueList.filter((item) => {
    if (activeFilter === 'inside') {
      return item.prefTags?.includes('Inside only') || item.prefTags?.includes('Booth') || !item.prefTags?.includes('🍃 Patio');
    }
    if (activeFilter === 'patio') {
      return item.statusTag?.includes('Patio') || item.prefTags?.includes('Patio');
    }
    if (activeFilter === 'large') {
      return item.guests >= 5;
    }
    return true;
  });

  // Handle Add Walk-in
  const handleAddWalkIn = () => {
    if (!guestName.trim()) {
      Alert.alert('Required', 'Please enter guest name');
      return;
    }

    const newParty: QueueParty = {
      id: `q-${Date.now()}`,
      number: queueList.length + 1,
      name: guestName.trim(),
      type: 'WALK-IN',
      statusTag: 'Just Added',
      statusTagVariant: 'info',
      guests: partySize,
      waitTime: '15 min wait',
      waitType: 'normal',
      prefTags: [pref],
    };

    setQueueList((prev) => [...prev, newParty]);
    setWalkInModalVisible(false);
    setGuestName('');
    setPhone('');
    setPartySize(2);

    Alert.alert('Added to Queue', `${newParty.name} (Party of ${partySize}) added to waitlist!`);
  };

  // Handle Seating Action
  const handleSeatNow = (name: string, table: string) => {
    Alert.alert(
      'Seat Party Now',
      `Confirm seating ${name} at Table ${table}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seat Guest',
          onPress: () => {
            setQueueList((prev) => prev.filter((p) => p.name !== name));
            Alert.alert('Seated!', `${name} has been seated at Table ${table}.`);
          },
        },
      ]
    );
  };

  // Handle Buzzer Action
  const handleBuzzGuest = (name: string) => {
    Alert.alert('Buzzer Triggered 🔔', `Paging ${name}'s buzzer device... SMS alert sent!`);
  };

  // Handle Call Action
  const handleCallGuest = (name: string) => {
    Alert.alert('Call Guest 📞', `Calling ${name} on phone...`);
  };

  // Navigation tabs handler
  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings' || tab === 'reservations') {
      router.push('/explore');
    } else if (tab === 'tables') {
      router.push('/tables');
    } else if (tab === 'alerts') {
      router.push('/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>


          {/* ─── Standalone Light Green Live Queue Section ───────────── */}
          <View style={styles.liveQueueSectionCard}>
            {/* Live Queue Title & Walk-in Row */}
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                <View style={styles.titleTextRow}>
                  <Text style={styles.titleText}>Live queue</Text>
                  <View style={styles.activeCountBadge}>
                    <Text style={styles.activeCountText}>{queueList.length} active</Text>
                  </View>
                </View>
                <View style={styles.subtitleRow}>
                  <View style={styles.liveGreenDot} />
                  <Text style={styles.subtitleText}>Updated 12s ago · Dinner Rush</Text>
                </View>
              </View>

              {/* Walk-in Button */}
              <Pressable
                onPress={() => router.push('/add-walkin')}
                style={({ pressed }) => [styles.walkInBtn, pressed && styles.pressed]}>
                <Icon name="plus" size={16} color="#FFFFFF" />
                <Text style={styles.walkInBtnText}> Walk-in</Text>
              </Pressable>
            </View>

            {/* Filter Pills Bar (Enlarged Buttons) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillsRow}>
              <Pressable
                onPress={() => setActiveFilter('all')}
                style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
                  All
                </Text>
                <View style={[styles.filterPillBadge, activeFilter === 'all' && styles.filterPillBadgeActive]}>
                  <Text style={[styles.filterPillBadgeText, activeFilter === 'all' && styles.filterPillBadgeTextActive]}>
                    7
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setActiveFilter('inside')}
                style={[styles.filterPill, activeFilter === 'inside' && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, activeFilter === 'inside' && styles.filterPillTextActive]}>
                  Inside
                </Text>
                <View style={styles.filterPillBadgeGreen}>
                  <Text style={styles.filterPillBadgeTextGreen}>4</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setActiveFilter('patio')}
                style={[styles.filterPill, activeFilter === 'patio' && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, activeFilter === 'patio' && styles.filterPillTextActive]}>
                  Patio
                </Text>
                <View style={styles.filterPillBadgeGreen}>
                  <Text style={styles.filterPillBadgeTextGreen}>3</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setActiveFilter('large')}
                style={[styles.filterPill, activeFilter === 'large' && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, activeFilter === 'large' && styles.filterPillTextActive]}>
                  Large groups
                </Text>
                <View style={styles.filterPillBadgeAmber}>
                  <Text style={styles.filterPillBadgeTextAmber}>1</Text>
                </View>
              </Pressable>
            </ScrollView>
          </View>

          {/* ─── Top Metrics Summary Card (Moved under Live Queue) ───── */}
          

          {/* ─── Featured READY TO SEAT NOW Card ─────────────────────── */}
          {featuredParty && (
            <View style={styles.featuredCard}>
              {/* Top Tag Badges Row */}
              <View style={styles.featuredBadgesRow}>
                <View style={styles.readyNowPill}>
                  <View style={styles.readyPulseDot} />
                  <Text style={styles.readyNowText}>READY TO SEAT NOW</Text>
                </View>

                <View style={styles.buzzerPill}>
                  <Text style={styles.buzzerText}>Buzzer 01:42</Text>
                </View>

                <View style={styles.tableNumberBox}>
                  <Text style={styles.tableNumberLabel}>Table</Text>
                  <Text style={styles.tableNumberValue}>T-07</Text>
                </View>
              </View>

              {/* Guest Main Info */}
              <View style={styles.featuredGuestRow}>
                <Text style={styles.featuredGuestName}>{featuredParty.name}</Text>
                <View style={styles.guestsBadge}>
                  <Text style={styles.guestsBadgeText}>{featuredParty.guests} Guests</Text>
                </View>
                {featuredParty.prefTags?.map((tag, i) => (
                  <View key={i} style={styles.prefBadgeIndigo}>
                    <Text style={styles.prefBadgeTextIndigo}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Sanitized Check Note */}
              <View style={styles.sanitizedNoteRow}>
                <Icon name="check" size={14} color="#059669" />
                <Text style={styles.sanitizedNoteText}>
                  Table 7 is sanitized & silverware placed
                </Text>
              </View>

              {/* 4 Steps Timeline Indicator */}
              <View style={styles.stepsRow}>
                <View style={styles.stepItem}>
                  <Text style={styles.stepLabelActive}>1. Check-In</Text>
                  <View style={styles.stepBarFilled} />
                </View>

                <View style={styles.stepItem}>
                  <Text style={styles.stepLabelActive}>2. Notified</Text>
                  <View style={styles.stepBarFilled} />
                </View>

                <View style={styles.stepItem}>
                  <Text style={styles.stepLabelActive}>3. Assigned</Text>
                  <View style={styles.stepBarFilled} />
                </View>

                <View style={styles.stepItem}>
                  <Text style={styles.stepLabelActive}>4. Ready</Text>
                  <View style={styles.stepBarReady} />
                </View>
              </View>

              {/* Action Buttons Row */}
              <View style={styles.featuredActionsRow}>
                <Pressable
                  onPress={() => handleSeatNow(featuredParty.name, '7')}
                  style={({ pressed }) => [styles.seatNowBtn, pressed && styles.pressed]}>
                  <Icon name="grid" size={18} color="#FFFFFF" />
                  <Text style={styles.seatNowBtnText}>Seat Now</Text>
                  <Icon name="chevron-right" size={16} color="#FFFFFF" />
                </Pressable>

                <Pressable
                  onPress={() => handleBuzzGuest(featuredParty.name)}
                  style={({ pressed }) => [styles.iconActionBtn, pressed && styles.pressed]}>
                  <Icon name="bell" size={16} color="#D97706" />
                  <Text style={styles.iconActionBtnText}>Buzz</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleCallGuest(featuredParty.name)}
                  style={({ pressed }) => [styles.iconActionBtn, pressed && styles.pressed]}>
                  <Icon name="phone" size={16} color="#2563EB" />
                  <Text style={styles.iconActionBtnText}>Call</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ─── WAITING LIST Section Header ────────────────────────── */}
          <View style={styles.waitingListHeaderRow}>
            <View style={styles.waitingListLeft}>
              <Text style={styles.waitingListTitle}>WAITING LIST</Text>
              <View style={styles.partiesCountBadge}>
                <Text style={styles.partiesCountText}>{filteredQueue.length} parties in queue</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setSortAsc(!sortAsc)}
              style={({ pressed }) => [styles.sortBtn, pressed && styles.pressed]}>
              <Text style={styles.sortBtnText}>Sort: By Time</Text>
              <Icon name="filter" size={14} color="#64748B" />
            </Pressable>
          </View>

          {/* ─── Waiting List Cards List ────────────────────────────── */}
          <View style={styles.queueListContainer}>
            {filteredQueue.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.queueCard,
                  item.number === 1 && styles.queueCardBorderReady,
                  item.number === 2 && styles.queueCardBorderNext,
                ]}>
                {/* Left Number Circle */}
                <View
                  style={[
                    styles.numberCircle,
                    item.number === 1 && styles.numberCircle1,
                    item.number === 2 && styles.numberCircle2,
                    item.number === 3 && styles.numberCircle3,
                  ]}>
                  <Text
                    style={[
                      styles.numberCircleText,
                      item.number <= 2 && styles.numberCircleTextWhite,
                    ]}>
                    {item.number}
                  </Text>
                </View>

                {/* Center Content */}
                <View style={styles.queueCardContent}>
                  {/* Name & Type Tag */}
                  <View style={styles.queueCardHeaderRow}>
                    <Text style={styles.queueGuestName}>{item.name}</Text>

                    <View
                      style={[
                        styles.typeBadge,
                        item.type === 'WALK-IN' && styles.typeBadgeWalkIn,
                      ]}>
                      <Text
                        style={[
                          styles.typeBadgeText,
                          item.type === 'WALK-IN' && styles.typeBadgeTextWalkIn,
                        ]}>
                        {item.type}
                      </Text>
                    </View>

                    {item.statusTag && (
                      <View
                        style={[
                          styles.statusTag,
                          item.statusTagVariant === 'ready' && styles.statusTagReady,
                          item.statusTagVariant === 'next' && styles.statusTagNext,
                          item.statusTagVariant === 'birthday' && styles.statusTagBirthday,
                        ]}>
                        <Text
                          style={[
                            styles.statusTagText,
                            item.statusTagVariant === 'ready' && styles.statusTagTextReady,
                            item.statusTagVariant === 'next' && styles.statusTagTextNext,
                            item.statusTagVariant === 'birthday' && styles.statusTagTextBirthday,
                          ]}>
                          {item.statusTag}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Guests & Wait Time */}
                  <View style={styles.queueCardMetaRow}>
                    <View style={styles.metaGuestsItem}>
                      <Icon name="users" size={13} color="#64748B" />
                      <Text style={styles.metaGuestsText}>{item.guests} guests</Text>
                    </View>

                    <Text style={styles.metaDot}>·</Text>

                    <View
                      style={[
                        styles.waitPill,
                        item.waitType === 'due' && styles.waitPillDue,
                      ]}>
                      {item.waitType !== 'due' && <Icon name="clock" size={11} color="#D97706" />}
                      <Text
                        style={[
                          styles.waitPillText,
                          item.waitType === 'due' && styles.waitPillTextDue,
                        ]}>
                        {item.waitTime}
                      </Text>
                    </View>
                  </View>

                  {/* Preferences Tags */}
                  {item.prefTags && item.prefTags.length > 0 && (
                    <View style={styles.prefTagsRow}>
                      {item.prefTags.map((t, idx) => (
                        <View key={idx} style={styles.prefTagItem}>
                          <Text style={styles.prefTagItemText}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Right Action Buttons */}
                <View style={styles.queueCardRightActions}>
                  {item.number === 1 ? (
                    <Pressable
                      onPress={() => handleSeatNow(item.name, '7')}
                      style={({ pressed }) => [styles.checkActionBtn, pressed && styles.pressed]}>
                      <Icon name="check" size={16} color="#059669" />
                    </Pressable>
                  ) : item.number === 2 ? (
                    <Pressable
                      onPress={() => Alert.alert('SMS Chat', `Opening SMS thread with ${item.name}...`)}
                      style={({ pressed }) => [styles.chatActionBtn, pressed && styles.pressed]}>
                      <Icon name="message" size={15} color="#059669" />
                    </Pressable>
                  ) : null}

                  <Pressable
                    onPress={() =>
                      Alert.alert('Queue Actions', `Options for ${item.name}`, [
                        { text: 'Notify Table Ready', onPress: () => handleBuzzGuest(item.name) },
                        { text: 'Call Guest', onPress: () => handleCallGuest(item.name) },
                        { text: 'Remove from Queue', style: 'destructive', onPress: () => setQueueList((prev) => prev.filter((p) => p.id !== item.id)) },
                        { text: 'Cancel', style: 'cancel' },
                      ])
                    }
                    style={({ pressed }) => [styles.moreActionBtn, pressed && styles.pressed]}>
                    <Icon name="more-vertical" size={16} color="#94A3B8" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* ─── Bottom Navigation Bar ───────────────────────────────── */}
        <BottomNavBar activeTab="queue" onSelectTab={handleTabChange} waitlistCount={queueList.length} />

        {/* ─── Walk-in Registration Modal ──────────────────────────── */}
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
                  style={styles.modalCloseBtn}>
                  <Icon name="close" size={18} color="#64748B" />
                </Pressable>
              </View>

              {/* Guest Name */}
              <Text style={styles.inputLabel}>GUEST NAME</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Samarasinghe"
                placeholderTextColor="#94A3B8"
                value={guestName}
                onChangeText={setGuestName}
              />

              {/* Phone Number */}
              <Text style={styles.inputLabel}>PHONE NUMBER (FOR SMS ALERT)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="077 123 4567"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {/* Party Size */}
              <Text style={styles.inputLabel}>PARTY SIZE</Text>
              <View style={styles.partySizeRow}>
                {[1, 2, 3, 4, 5, 6, 8].map((size) => (
                  <Pressable
                    key={size}
                    onPress={() => setPartySize(size)}
                    style={[styles.partyBtn, partySize === size && styles.partyBtnActive]}>
                    <Text style={[styles.partyBtnText, partySize === size && styles.partyBtnTextActive]}>
                      {size}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Seating Preference */}
              <Text style={styles.inputLabel}>SEATING PREFERENCE</Text>
              <View style={styles.prefRow}>
                {(['Inside', 'Patio', 'Booth'] as const).map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPref(p)}
                    style={[styles.prefBtn, pref === p && styles.prefBtnActive]}>
                    <Text style={[styles.prefBtnText, pref === p && styles.prefBtnTextActive]}>
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Modal Action Buttons */}
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setWalkInModalVisible(false)}
                  style={styles.modalCancelBtn}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>

                <Pressable onPress={handleAddWalkIn} style={styles.modalSubmitBtn}>
                  <Text style={styles.modalSubmitText}>Add to Queue</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 24,
  },

  // ─── Top Dark Summary Card ─────────────────────────
  topMetricsCard: {
    backgroundColor: '#74948dff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  kpiColumn: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  kpiUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A7F3D0',
  },
  kpiSubValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6EE7B7',
  },
  kpiDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  kpiBadgeAmber: {
    marginTop: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  kpiBadgeTextAmber: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FBBF24',
  },
  kpiBadgeGreen: {
    marginTop: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  kpiBadgeTextGreen: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#34D399',
  },
  kpiBadgeCheck: {
    marginTop: 3,
    backgroundColor: 'rgba(52, 211, 153, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  kpiBadgeTextCheck: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#6EE7B7',
  },

  // ─── Live Queue Standalone Card Section ────────────
  liveQueueSectionCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 16,
    paddingBottom: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderTopColor: '#F0FDF4',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 6,
    marginBottom: 16,
  },

  // ─── Title Row ─────────────────────────────────────
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  titleLeft: {},
  titleTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: -0.5,
  },
  activeCountBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeCountText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  walkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#044E38',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#044E38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  walkInBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // ─── Filter Pills Bar (Enlarged) ───────────────────
  filterPillsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: '#044E38',
    borderColor: '#044E38',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterPillBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterPillBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
  },
  filterPillBadgeTextActive: {
    color: '#FFFFFF',
  },
  filterPillBadgeGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterPillBadgeTextGreen: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  filterPillBadgeAmber: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterPillBadgeTextAmber: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#D97706',
  },

  // ─── Featured READY TO SEAT Card ───────────────────
  featuredCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  featuredBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  readyNowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  readyPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#047857',
  },
  readyNowText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: 0.3,
  },
  buzzerPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  buzzerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  tableNumberBox: {
    marginLeft: 'auto',
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tableNumberLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: '#A7F3D0',
  },
  tableNumberValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featuredGuestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  featuredGuestName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: -0.3,
  },
  guestsBadge: {
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  guestsBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#065F46',
  },
  prefBadgeIndigo: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  prefBadgeTextIndigo: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4338CA',
  },
  sanitizedNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sanitizedNoteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  stepItem: {
    flex: 1,
  },
  stepLabelActive: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  stepBarFilled: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#059669',
  },
  stepBarReady: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34D399',
  },
  featuredActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seatNowBtn: {
    flex: 1.6,
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  seatNowBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  iconActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  iconActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  // ─── WAITING LIST Header ───────────────────────────
  waitingListHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  waitingListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waitingListTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  partiesCountBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partiesCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },

  // ─── Waiting List Items ────────────────────────────
  queueListContainer: {
    gap: 10,
  },
  queueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  queueCardBorderReady: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  queueCardBorderNext: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberCircle1: {
    backgroundColor: '#10B981',
  },
  numberCircle2: {
    backgroundColor: '#F59E0B',
  },
  numberCircle3: {
    backgroundColor: '#D1FAE5',
  },
  numberCircleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  numberCircleTextWhite: {
    color: '#FFFFFF',
  },
  queueCardContent: {
    flex: 1,
  },
  queueCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  queueGuestName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  typeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  typeBadgeWalkIn: {
    backgroundColor: '#EEF2FF',
  },
  typeBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
  },
  typeBadgeTextWalkIn: {
    color: '#4F46E5',
  },
  statusTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  statusTagReady: {
    backgroundColor: '#10B981',
  },
  statusTagNext: {
    backgroundColor: '#F97316',
  },
  statusTagBirthday: {
    backgroundColor: '#FCE7F3',
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  statusTagTextReady: {
    color: '#FFFFFF',
  },
  statusTagTextNext: {
    color: '#FFFFFF',
  },
  statusTagTextBirthday: {
    color: '#DB2777',
  },
  queueCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaGuestsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaGuestsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  metaDot: {
    color: '#94A3B8',
  },
  waitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waitPillDue: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  waitPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  waitPillTextDue: {
    color: '#DC2626',
    fontWeight: '700',
  },
  prefTagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  prefTagItem: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prefTagItemText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  queueCardRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 6,
  },
  checkActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  // ─── Modal ─────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
    color: '#0F172A',
  },
  partySizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  partyBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyBtnActive: {
    backgroundColor: '#044E38',
  },
  partyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  partyBtnTextActive: {
    color: '#FFFFFF',
  },
  prefRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prefBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  prefBtnActive: {
    backgroundColor: '#044E38',
  },
  prefBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  prefBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalSubmitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#044E38',
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
