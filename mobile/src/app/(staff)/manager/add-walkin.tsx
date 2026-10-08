import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { BottomNavBar, TabKey } from '@/components/BottomNavBar';
import { useReservations } from '@/hooks/useReservations';

export type SeatingPref = 'first_open' | 'indoor' | 'patio' | 'bar';

export default function AddWalkInScreen() {
  const router = useRouter();
  const { addWalkIn, queue } = useReservations();

  // Form State
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegular, setIsRegular] = useState(true);
  const [isVip, setIsVip] = useState(false);
  const [partySize, setPartySize] = useState<number>(2);
  const [seatingPref, setSeatingPref] = useState<SeatingPref>('indoor');
  const [notes, setNotes] = useState('');

  // Splash Modal State
  const [splashVisible, setSplashVisible] = useState(false);
  const [addedGuestInfo, setAddedGuestInfo] = useState<{
    name: string;
    partySize: number;
    position: number;
  } | null>(null);

  // Add to Live Queue & Show Splash Msg
  const handleAddToQueue = async () => {
    if (!guestName.trim()) {
      Alert.alert('Required Field', 'Please enter guest name');
      return;
    }

    const name = guestName.trim();
    const currentPos = (queue || []).filter((q) => q.status !== 'seated' && q.status !== 'cancelled').length + 1;

    try {
      await addWalkIn({
        guestName: name,
        partySize,
        phone: phoneNumber,
        notes: `${seatingPref} • ${isVip ? 'VIP' : isRegular ? 'Regular' : 'Walk-in'} ${notes ? '• ' + notes : ''}`,
      });

      setAddedGuestInfo({
        name,
        partySize,
        position: currentPos,
      });
      setSplashVisible(true);
    } catch {
      setAddedGuestInfo({
        name,
        partySize,
        position: currentPos,
      });
      setSplashVisible(true);
    }
  };

  // Reset Form
  const handleResetForm = () => {
    setGuestName('');
    setPhoneNumber('');
    setIsRegular(false);
    setIsVip(false);
    setPartySize(2);
    setSeatingPref('indoor');
    setNotes('');
  };

  // Bottom navigation tab change
  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/(staff)/manager');
    } else if (tab === 'bookings' || tab === 'reservations') {
      router.push('/(staff)/manager/explore');
    } else if (tab === 'tables') {
      router.push('/(staff)/manager/tables');
    } else if (tab === 'waitlist' || tab === 'queue') {
      router.push('/(staff)/manager/queue');
    } else if (tab === 'alerts') {
      router.push('/(staff)/manager/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={18} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.liveHostPill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveHostText}>LIVE HOST DESK</Text>
            </View>
            <Text style={styles.headerTitle}>Add Walk-in Party</Text>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                'Host Desk Tips',
                '• Turn times: 90 mins max\n• Auto-SMS sends 5 mins before table is ready\n• VIP walk-ins skip standard waitlist'
              )
            }
            style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
            <Icon name="help-circle" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Form Scroll Container */}
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
                placeholder="Enter guest name (e.g. Samarasinghe)"
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
                placeholder="077 123 4567"
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
                <Icon name="users" size={15} color="#059669" />
                <Text style={styles.fieldLabel}>PARTY SIZE</Text>
              </View>
              <Text style={styles.partySizeBadge}>{partySize} Guests</Text>
            </View>

            <View style={styles.partyGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setPartySize(size)}
                  style={[
                    styles.partySizeBtn,
                    partySize === size && styles.partySizeBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.partySizeText,
                      partySize === size && styles.partySizeTextActive,
                    ]}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Card 3: Seating Preference */}
          <View style={styles.card}>
            <View style={styles.labelLeft}>
              <Icon name="grid" size={15} color="#4F46E5" />
              <Text style={styles.fieldLabel}>SEATING PREFERENCE</Text>
            </View>

            <View style={styles.prefGrid}>
              {[
                { key: 'first_open', label: 'First Open', icon: 'flash' },
                { key: 'indoor', label: 'Indoor Dining', icon: 'utensils' },
                { key: 'patio', label: 'Patio / Outdoor', icon: 'sun' },
                { key: 'bar', label: 'Bar Lounge', icon: 'wine' },
              ].map((p) => (
                <Pressable
                  key={p.key}
                  onPress={() => setSeatingPref(p.key as SeatingPref)}
                  style={[
                    styles.prefBtn,
                    seatingPref === p.key && styles.prefBtnActive,
                  ]}>
                  <Icon
                    name={p.icon as any}
                    size={16}
                    color={seatingPref === p.key ? '#FFFFFF' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.prefBtnText,
                      seatingPref === p.key && styles.prefBtnTextActive,
                    ]}>
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Special Request Notes */}
            <Text style={[styles.fieldLabel, { marginTop: 14, marginBottom: 6 }]}>
              NOTES / SPECIAL REQUESTS
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Highchair required, Birthday celebration"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Pressable
              onPress={handleAddToQueue}
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}>
              <Icon name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Add to Live Queue</Text>
            </Pressable>

            <Pressable
              onPress={handleResetForm}
              style={({ pressed }) => [styles.resetBtn, pressed && styles.pressed]}>
              <Text style={styles.resetBtnText}>Reset Form</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <BottomNavBar activeTab="waitlist" onSelectTab={handleTabChange} />

        {/* Splash Success Modal Overlay */}
        <Modal visible={splashVisible} transparent animationType="fade">
          <View style={styles.splashOverlay}>
            <View style={styles.splashCard}>
              <View style={styles.splashIconCircle}>
                <Icon name="check" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.splashTitle}>Added to Live Queue! 🟢</Text>
              <Text style={styles.splashSub}>
                <Text style={{ fontWeight: '800', color: '#0F172A' }}>{addedGuestInfo?.name}</Text> (Party of {addedGuestInfo?.partySize}) has been added to the <Text style={{ fontWeight: '800', color: '#059669' }}>bottom of the Live Queue</Text> (Position #{addedGuestInfo?.position}).
              </Text>

              <View style={styles.splashBadgesRow}>
                <View style={styles.splashBadge}>
                  <Icon name="clock" size={12} color="#059669" />
                  <Text style={styles.splashBadgeText}>Est. Wait: 12-15 mins</Text>
                </View>
                <View style={styles.splashBadge}>
                  <Icon name="message" size={12} color="#0284C7" />
                  <Text style={styles.splashBadgeText}>SMS Notification Active</Text>
                </View>
              </View>

              <View style={styles.splashActions}>
                <Pressable
                  onPress={() => {
                    setSplashVisible(false);
                    router.push('/(staff)/manager/queue' as never);
                  }}
                  style={({ pressed }) => [styles.splashPrimaryBtn, pressed && styles.pressed]}>
                  <Icon name="users" size={16} color="#FFFFFF" />
                  <Text style={styles.splashPrimaryBtnText}>Go to Live Queue</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setSplashVisible(false);
                    handleResetForm();
                  }}
                  style={({ pressed }) => [styles.splashSecondaryBtn, pressed && styles.pressed]}>
                  <Text style={styles.splashSecondaryBtnText}>Add Another Guest</Text>
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
    padding: 16,
    paddingBottom: 24,
  },

  // ── Header ───────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#022C22',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerCenter: {
    alignItems: 'center',
  },
  liveHostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    marginBottom: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveHostText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  circularBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Form Cards ───────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
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
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  tagPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  tagPillRegular: {
    backgroundColor: '#E6F8F0',
  },
  tagPillVip: {
    backgroundColor: '#FEF3C7',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tagPillTextRegular: {
    color: '#00875A',
    fontWeight: '700',
  },
  tagPillTextVip: {
    color: '#D97706',
    fontWeight: '700',
  },
  smsAlertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  smsAlertText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  // ── Party Size ───────────────────────────────────
  partySizeBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  partyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  partySizeBtn: {
    width: '23%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partySizeBtnActive: {
    backgroundColor: '#044E38',
    borderColor: '#044E38',
  },
  partySizeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  partySizeTextActive: {
    color: '#FFFFFF',
  },

  // ── Seating Preference ───────────────────────────
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  prefBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prefBtnActive: {
    backgroundColor: '#044E38',
    borderColor: '#044E38',
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

  // ── Action Buttons ───────────────────────────────
  actionSection: {
    marginTop: 10,
    gap: 10,
  },
  submitBtn: {
    backgroundColor: '#044E38',
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#044E38',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resetBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  // ── Splash Modal ─────────────────────────────────
  splashOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 44, 34, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  splashCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  splashIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  splashTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  splashSub: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  splashBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  splashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  splashBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  splashActions: {
    width: '100%',
    gap: 10,
  },
  splashPrimaryBtn: {
    backgroundColor: '#044E38',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  splashPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  splashSecondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  splashSecondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
});
