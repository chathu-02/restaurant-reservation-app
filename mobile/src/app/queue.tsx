import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { BottomNavBar, TabKey } from '@/components/BottomNavBar';
import { useReservations } from '@/hooks/useReservations';

export type SeatingPref = 'first_open' | 'indoor' | 'patio' | 'bar';

export default function QueueScreen() {
  const router = useRouter();
  const { queue } = useReservations();

  // Form State matching screenshot
  const [guestName, setGuestName] = useState('Sophia Martinez');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-8900');
  const [isRegular, setIsRegular] = useState(true);
  const [isVip, setIsVip] = useState(false);
  const [partySize, setPartySize] = useState<number>(2);
  const [seatingPref, setSeatingPref] = useState<SeatingPref>('indoor');

  // Waitlist list modal toggle
  const [waitlistModalVisible, setWaitlistModalVisible] = useState(false);
  const [localQueue, setLocalQueue] = useState(queue);

  // Add to Live Queue
  const handleAddToQueue = () => {
    if (!guestName.trim()) {
      Alert.alert('Required', 'Please enter guest name');
      return;
    }

    const newItem = {
      id: `queue-${Date.now()}`,
      guestName: guestName.trim(),
      partySize,
      joinedAt: 'Just now',
      estimatedWaitMinutes: partySize > 4 ? 25 : 15,
      phone: phoneNumber,
      notes: `${seatingPref} • ${isVip ? 'VIP' : isRegular ? 'Regular' : 'Walk-in'}`,
    };

    setLocalQueue((prev) => [newItem, ...prev]);

    Alert.alert(
      'Added to Live Queue',
      `${guestName} (Party of ${partySize}) added to waitlist. SMS confirmation sent to ${phoneNumber}.`,
      [
        {
          text: 'View Waitlist',
          onPress: () => setWaitlistModalVisible(true),
        },
        { text: 'OK' },
      ]
    );
  };

  // Reset Form
  const handleResetForm = () => {
    setGuestName('');
    setPhoneNumber('');
    setIsRegular(false);
    setIsVip(false);
    setPartySize(2);
    setSeatingPref('indoor');
  };

  // Bottom navigation tab change
  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings') {
      router.push('/explore');
    } else if (tab === 'tables') {
      router.push('/tables');
    } else if (tab === 'alerts') {
      router.push('/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9EC" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={18} color="#111827" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.liveHostPill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveHostText}>LIVE HOST DESK</Text>
            </View>
            <Text style={styles.headerTitle}>Add Walk-in</Text>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                'Host Desk Tips',
                '• Turn times: 90 mins max\n• Auto-SMS sends 5 mins before table is ready\n• VIP walk-ins skip standard waitlist'
              )
            }
            style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
            <Icon name="help-circle" size={20} color="#4B5563" />
          </Pressable>
        </View>

        {/* Scrollable Form Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Card 1: Guest Information */}
          <View style={styles.card}>
            {/* Label Row: Guest Name */}
            <View style={styles.fieldLabelRow}>
              <View style={styles.labelLeft}>
                <Icon name="person" size={15} color="#EA580C" />
                <Text style={styles.fieldLabel}>GUEST NAME *</Text>
              </View>

              <View style={styles.tagPillsRow}>
                <Pressable
                  onPress={() => setIsRegular(!isRegular)}
                  style={[styles.tagPill, isRegular && styles.tagPillRegular]}>
                  {isRegular && <Icon name="check" size={10} color="#00875A" />}
                  <Text style={[styles.tagPillText, isRegular && styles.tagPillTextRegular]}>
                    Regular
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setIsVip(!isVip)}
                  style={[styles.tagPill, isVip && styles.tagPillVip]}>
                  <Text style={[styles.tagPillText, isVip && styles.tagPillTextVip]}>
                    VIP
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Guest Name Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={guestName}
                onChangeText={setGuestName}
                placeholder="Enter guest name"
                placeholderTextColor="#9CA3AF"
              />
              <Icon name="pencil" size={16} color="#009669" />
            </View>

            {/* Label Row: Phone Number */}
            <View style={[styles.fieldLabelRow, { marginTop: 14 }]}>
              <View style={styles.labelLeft}>
                <Icon name="phone" size={15} color="#2563EB" />
                <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              </View>

              <View style={styles.smsAlertPill}>
                <Icon name="bell" size={11} color="#0284C7" />
                <Text style={styles.smsAlertText}>SMS Ready Alert</Text>
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              <Icon name="message" size={16} color="#009669" />
            </View>
          </View>

          {/* Card 2: Party Size */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.labelLeft}>
                <Icon name="users" size={16} color="#009669" />
                <Text style={styles.fieldLabel}>PARTY SIZE</Text>
              </View>

              <View style={styles.partyBadge}>
                <Icon name="check" size={11} color="#FFFFFF" />
                <Text style={styles.partyBadgeText}>{partySize} Guests</Text>
              </View>
            </View>

            {/* Number Grid: 1-4 and 5-8+ */}
            <View style={styles.partyGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                const isSelected = partySize === num;
                const isEightPlus = num === 8;
                const label = isEightPlus ? '8+' : `${num}`;

                return (
                  <Pressable
                    key={num}
                    onPress={() => setPartySize(num)}
                    style={[
                      styles.partyTile,
                      isSelected && styles.partyTileSelected,
                      isEightPlus && !isSelected && styles.partyTileEightPlus,
                    ]}>
                    <Text
                      style={[
                        styles.partyTileText,
                        isSelected && styles.partyTileTextSelected,
                        isEightPlus && !isSelected && styles.partyTileTextEightPlus,
                      ]}>
                      {label}
                      {isSelected && ' •'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Card 3: Seating Preference */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.labelLeft}>
                <Icon name="table" size={16} color="#7C3AED" />
                <Text style={styles.fieldLabel}>SEATING PREFERENCE</Text>
              </View>
              <Text style={styles.prefSubtitle}>Standard Dining</Text>
            </View>

            {/* 2x2 Grid of Preferences */}
            <View style={styles.prefGrid}>
              {/* 1. First Open */}
              <Pressable
                onPress={() => setSeatingPref('first_open')}
                style={[
                  styles.prefTile,
                  styles.prefTileFirstOpen,
                  seatingPref === 'first_open' && styles.prefTileActive,
                ]}>
                <View style={styles.prefTileTop}>
                  <Icon name="flash" size={16} color="#D97706" />
                  <Text style={styles.prefTitle}>First Open</Text>
                  {seatingPref === 'first_open' && (
                    <Icon name="check" size={13} color="#009669" />
                  )}
                </View>
                <Text style={styles.prefSub}>Fastest table</Text>
              </Pressable>

              {/* 2. Indoor */}
              <Pressable
                onPress={() => setSeatingPref('indoor')}
                style={[
                  styles.prefTile,
                  styles.prefTileIndoor,
                  seatingPref === 'indoor' && styles.prefTileActive,
                ]}>
                <View style={styles.prefTileTop}>
                  <Icon name="table" size={16} color="#009669" />
                  <Text style={styles.prefTitle}>Indoor</Text>
                  {seatingPref === 'indoor' && (
                    <Icon name="check" size={13} color="#009669" />
                  )}
                </View>
                <Text style={styles.prefSub}>AC Main Hall</Text>
              </Pressable>

              {/* 3. Patio Garden */}
              <Pressable
                onPress={() => setSeatingPref('patio')}
                style={[
                  styles.prefTile,
                  styles.prefTilePatio,
                  seatingPref === 'patio' && styles.prefTileActive,
                ]}>
                <View style={styles.prefTileTop}>
                  <Icon name="sun" size={16} color="#EA580C" />
                  <Text style={styles.prefTitle}>Patio Garden</Text>
                  {seatingPref === 'patio' && (
                    <Icon name="check" size={13} color="#009669" />
                  )}
                </View>
                <Text style={styles.prefSub}>Outdoor terrace</Text>
              </Pressable>

              {/* 4. Bar / High-top */}
              <Pressable
                onPress={() => setSeatingPref('bar')}
                style={[
                  styles.prefTile,
                  styles.prefTileBar,
                  seatingPref === 'bar' && styles.prefTileActive,
                ]}>
                <View style={styles.prefTileTop}>
                  <Icon name="wine" size={16} color="#9333EA" />
                  <Text style={styles.prefTitle}>Bar / High-top</Text>
                  {seatingPref === 'bar' && (
                    <Icon name="check" size={13} color="#009669" />
                  )}
                </View>
                <Text style={styles.prefSub}>No wait cocktail</Text>
              </Pressable>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Sticky Bottom Actions */}
        <View style={styles.bottomBar}>
          {/* Primary Button */}
          <Pressable
            onPress={handleAddToQueue}
            style={({ pressed }) => [styles.addQueueBtn, pressed && styles.pressed]}>
            <Icon name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addQueueBtnText}>Add to Live Queue</Text>
          </Pressable>

          {/* Secondary Links Row */}
          <View style={styles.bottomLinksRow}>
            <Pressable
              onPress={handleResetForm}
              style={({ pressed }) => [styles.linkItem, pressed && styles.pressed]}>
              <Icon name="refresh" size={13} color="#009669" />
              <Text style={styles.linkText}>Reset Form</Text>
            </Pressable>

            <Text style={styles.linkDot}>•</Text>

            <Pressable
              onPress={() => setWaitlistModalVisible(true)}
              style={({ pressed }) => [styles.linkItem, pressed && styles.pressed]}>
              <Icon name="book" size={13} color="#009669" />
              <Text style={styles.linkText}>View Waitlist ({localQueue.length})</Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab="waitlist"
          onSelectTab={handleTabChange}
          waitlistCount={localQueue.length}
        />
      </View>

      {/* View Waitlist Modal */}
      <Modal
        visible={waitlistModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWaitlistModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Current Live Waitlist</Text>
                <Text style={styles.modalSubtitle}>
                  {localQueue.length} parties currently waiting
                </Text>
              </View>
              <Pressable
                onPress={() => setWaitlistModalVisible(false)}
                style={styles.modalCloseBtn}>
                <Icon name="close" size={18} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {localQueue.map((item, idx) => (
                <View key={item.id} style={styles.queueItemCard}>
                  <View style={styles.queuePosBadge}>
                    <Text style={styles.queuePosText}>#{idx + 1}</Text>
                  </View>
                  <View style={styles.queueItemInfo}>
                    <Text style={styles.queueItemName}>{item.guestName}</Text>
                    <Text style={styles.queueItemMeta}>
                      Party of {item.partySize} • ~{item.estimatedWaitMinutes}m wait{item.notes ? ` • ${item.notes}` : ''}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Alert.alert(
                        'Seat Guest',
                        `Seat ${item.guestName} now? This will release their queue spot.`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Seat Now',
                            onPress: () => {
                              setLocalQueue((prev) => prev.filter((q) => q.id !== item.id));
                              Alert.alert('Seated', `${item.guestName} marked as seated.`);
                            },
                          },
                        ]
                      );
                    }}
                    style={styles.seatPillBtn}>
                    <Text style={styles.seatPillBtnText}>Seat</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
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
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F4F9EC',
  },
  circularBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  liveHostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    marginBottom: 2,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  liveHostText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  tagPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagPillRegular: {
    backgroundColor: '#E6F8F0',
  },
  tagPillVip: {
    backgroundColor: '#F3E8FF',
  },
  tagPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  tagPillTextRegular: {
    color: '#00875A',
  },
  tagPillTextVip: {
    color: '#7E22CE',
  },
  smsAlertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  smsAlertText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  partyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  partyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  partyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  partyTile: {
    width: '23%',
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyTileSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  partyTileEightPlus: {
    backgroundColor: '#FEF9EE',
    borderColor: '#FDE68A',
  },
  partyTileText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  partyTileTextSelected: {
    color: '#FFFFFF',
  },
  partyTileTextEightPlus: {
    color: '#B45309',
  },
  prefSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#009669',
  },
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  prefTile: {
    width: '48.5%',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  prefTileFirstOpen: {
    backgroundColor: '#FEFBF3',
    borderColor: '#FDE68A',
  },
  prefTileIndoor: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  prefTilePatio: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  prefTileBar: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  prefTileActive: {
    borderColor: '#009669',
    borderWidth: 2,
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  prefTileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  prefTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  prefSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    gap: 8,
  },
  addQueueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
    height: 48,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addQueueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009669',
  },
  linkDot: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    maxHeight: 380,
  },
  queueItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 10,
  },
  queuePosBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  queuePosText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  queueItemInfo: {
    flex: 1,
  },
  queueItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  queueItemMeta: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  seatPillBtn: {
    backgroundColor: '#009669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  seatPillBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
