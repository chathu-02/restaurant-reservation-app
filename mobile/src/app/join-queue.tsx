import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { validateSriLankanPhone, formatPhoneDisplay } from '@/lib/phone';
import customerQueueService from '@/services/customerQueue.service';
import { SeatingPreferenceType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/lib/firebase';

export default function JoinQueueScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [seatingPref, setSeatingPref] = useState<SeatingPreferenceType>('Indoor');
  const [specialReq, setSpecialReq] = useState('');

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Dynamic live wait stats
  const [groupsAhead, setGroupsAhead] = useState(2);
  const [currentWaitMin, setCurrentWaitMin] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partyPills = [2, 4, 6, 8];

  // Pre-fill user details if logged in or stored in customer profile
  useEffect(() => {
    const prefillData = async () => {
      try {
        if (auth.currentUser?.displayName && !fullName) {
          setFullName(auth.currentUser.displayName);
        }
        if (auth.currentUser?.phoneNumber && !phone) {
          setPhone(auth.currentUser.phoneNumber);
        }

        const storedProfileRaw = await AsyncStorage.getItem('@customer_profile');
        if (storedProfileRaw) {
          const profile = JSON.parse(storedProfileRaw);
          if (profile?.name && !fullName) setFullName(profile.name);
          if (profile?.phone && !phone) setPhone(profile.phone);
        }
      } catch {}
    };

    prefillData();
  }, []);

  // Fetch live queue statistics for accurate live display
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const stats = await customerQueueService.getLiveQueueStats();
        if (isMounted) {
          setGroupsAhead(stats.waitingCount);
          setCurrentWaitMin(stats.waitMinutes);
        }
      } catch {}
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute estimated seating time dynamically
  const getEstimatedSeatingTime = () => {
    const d = new Date(Date.now() + currentWaitMin * 60000);
    return `~${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  const handleJoin = async () => {
    let hasError = false;

    // 1. Full name validation
    if (!fullName.trim()) {
      setNameError('Please enter your full name');
      hasError = true;
    } else if (fullName.trim().length < 2) {
      setNameError('Full name must be at least 2 characters');
      hasError = true;
    } else {
      setNameError('');
    }

    // 2. Sri Lankan Phone Number validation
    const phoneValidation = validateSriLankanPhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Please enter a valid Sri Lankan phone number');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (hasError) return;

    try {
      setIsSubmitting(true);

      const queueEntry = await customerQueueService.joinQueue({
        fullName: fullName.trim(),
        phoneNumber: phoneValidation.normalized,
        partySize,
        seatingPreference: seatingPref,
        specialRequests: specialReq.trim() || undefined,
      });

      router.push({
        pathname: '/queue',
        params: { queueId: queueEntry.id },
      });
    } catch (err: any) {
      console.error('Queue join failure:', err);
      Alert.alert(
        'Unable to Join Queue',
        err?.message || 'Could not connect to the queue service. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(customer)/(tabs)/home' as never);
              }
            }}
          >
            <Icon name="chevron-left" size={20} color="#111827" />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Join the queue</Text>
            <Text style={styles.headerSubtitle}>
              The Green Terrace <Text style={{ color: '#9CA3AF' }}>• Riverside Ave</Text>
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Wait Banner Card */}
        <View style={styles.waitCard}>
          <View style={styles.waitLeft}>
            <View style={styles.waitIconBox}>
              <View style={styles.waitIconInner} />
            </View>
            <View>
              <Text style={styles.waitTitle}>Current wait ~{currentWaitMin} min</Text>
              <View style={styles.groupsRow}>
                <Icon name="users" size={13} color="#009669" />
                <Text style={styles.groupsText}>
                  <Text style={{ fontWeight: '800', color: '#111827' }}>
                    {groupsAhead} {groupsAhead === 1 ? 'group' : 'groups'}
                  </Text>{' '}
                  ahead of you
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.fastTurnBadge}>
            <Text style={styles.fastTurnText}>FAST TURN</Text>
          </View>
        </View>

        {/* FULL NAME */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>FULL NAME</Text>
          <View style={[styles.inputBox, nameError ? styles.inputBoxError : null]}>
            <Icon name="person" size={18} color={nameError ? '#EF4444' : '#9CA3AF'} />
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) setNameError('');
              }}
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        {/* SRI LANKAN PHONE NUMBER */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
            <Text style={styles.helperText}>For SMS updates</Text>
          </View>
          <View style={[styles.phoneBox, phoneError ? styles.inputBoxError : null]}>
            <View style={styles.countryCodeBadge}>
              <Text style={styles.flagIcon}>🇱🇰</Text>
              <Text style={styles.countryCode}>+94</Text>
            </View>
            <View style={styles.vDivider} />
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (phoneError) setPhoneError('');
              }}
              placeholder="077 123 4567"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

        {/* PARTY SIZE */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PARTY SIZE</Text>
          <View style={styles.stepperBox}>
            <View style={styles.stepperLeft}>
              <Icon name="users" size={18} color="#9CA3AF" />
              <Text style={styles.stepperValueText}>
                {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
              </Text>
            </View>
            <View style={styles.counterRow}>
              <Pressable
                onPress={() => setPartySize((prev) => Math.max(1, prev - 1))}
                style={({ pressed }) => [styles.counterBtn, pressed && styles.pressed]}
                accessibilityLabel="Decrease guests"
              >
                <Icon name="minus" size={14} color="#374151" />
              </Pressable>
              <Text style={styles.counterNumber}>{partySize}</Text>
              <Pressable
                onPress={() => setPartySize((prev) => Math.min(99, prev + 1))}
                style={({ pressed }) => [styles.counterBtnDark, pressed && styles.pressed]}
                accessibilityLabel="Increase guests"
              >
                <Icon name="plus" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Quick pills */}
          <View style={styles.pillsRow}>
            {partyPills.map((count) => {
              const isSelected = count === 8 ? partySize >= 8 : partySize === count;
              const label = count === 8 ? '8+ ppl' : `${count} ppl`;
              return (
                <Pressable
                  key={count}
                  onPress={() => {
                    if (count === 8) {
                      setPartySize(Math.max(8, partySize));
                    } else {
                      setPartySize(count);
                    }
                  }}
                  style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom Large Party Input if 8+ is selected */}
          {partySize >= 8 ? (
            <View style={styles.customPartyRow}>
              <Text style={styles.customPartyLabel}>Custom guest count for 8+:</Text>
              <View style={styles.customPartyInputWrap}>
                <TextInput
                  style={styles.customPartyInput}
                  value={String(partySize)}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    const cleanNum = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    if (!isNaN(cleanNum) && cleanNum > 0) {
                      setPartySize(Math.min(99, cleanNum));
                    } else if (text === '') {
                      setPartySize(8);
                    }
                  }}
                  maxLength={3}
                />
                <Text style={styles.customPartySuffix}>guests</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* SEATING PREFERENCE */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>SEATING PREFERENCE</Text>
            <Text style={styles.helperText}>Select one</Text>
          </View>
          <View style={styles.preferenceGrid}>
            {/* Indoor */}
            <Pressable
              onPress={() => setSeatingPref('Indoor')}
              style={[styles.prefCard, seatingPref === 'Indoor' && styles.prefCardActive]}
            >
              <Icon
                name="armchair"
                size={22}
                color={seatingPref === 'Indoor' ? '#38BDF8' : '#6B7280'}
              />
              <Text style={[styles.prefTitle, seatingPref === 'Indoor' && styles.prefTextActive]}>
                Indoor
              </Text>
              <Text style={[styles.prefSub, seatingPref === 'Indoor' && styles.prefSubActive]}>
                Dining hall
              </Text>
            </Pressable>

            {/* Outdoor */}
            <Pressable
              onPress={() => setSeatingPref('Outdoor')}
              style={[styles.prefCard, seatingPref === 'Outdoor' && styles.prefCardActive]}
            >
              <Icon
                name="leaf"
                size={22}
                color={seatingPref === 'Outdoor' ? '#34D399' : '#059669'}
              />
              <Text style={[styles.prefTitle, seatingPref === 'Outdoor' && styles.prefTextActive]}>
                Outdoor
              </Text>
              <Text style={[styles.prefSub, seatingPref === 'Outdoor' && styles.prefSubActive]}>
                Garden patio
              </Text>
            </Pressable>

            {/* Any table */}
            <Pressable
              onPress={() => setSeatingPref('Any Table')}
              style={[styles.prefCard, (seatingPref === 'Any Table' || seatingPref === 'Any table') && styles.prefCardActive]}
            >
              <Icon
                name="sparkles"
                size={22}
                color={seatingPref === 'Any Table' || seatingPref === 'Any table' ? '#FBBF24' : '#D97706'}
              />
              <Text
                style={[
                  styles.prefTitle,
                  (seatingPref === 'Any Table' || seatingPref === 'Any table') && styles.prefTextActive,
                ]}
              >
                Any Table
              </Text>
              <Text
                style={[
                  styles.prefSub,
                  { color: '#009669', fontWeight: '800' },
                  (seatingPref === 'Any Table' || seatingPref === 'Any table') && { color: '#34D399' },
                ]}
              >
                Fastest
              </Text>
            </Pressable>
          </View>
        </View>

        {/* SPECIAL REQUESTS */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SPECIAL REQUESTS (OPTIONAL)</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={[styles.textInput, { paddingLeft: 4 }]}
              value={specialReq}
              onChangeText={setSpecialReq}
              placeholder="e.g. High chair needed, garden view or booth"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* SMS Banner */}
        <View style={styles.smsNotice}>
          <Icon name="bell" size={18} color="#009669" style={{ marginTop: 2 }} />
          <Text style={styles.smsText}>
            We'll send an SMS to your Sri Lankan number when your table is{' '}
            <Text style={{ fontWeight: '800' }}>5 minutes away</Text>. You won't lose your spot in line.
          </Text>
        </View>

        {/* Estimated Seating Row */}
        <View style={styles.estimatedRow}>
          <View style={styles.estimatedLeft}>
            <View style={styles.greenDot} />
            <Text style={styles.estimatedLabel}>Estimated seating time</Text>
          </View>
          <Text style={styles.estimatedTime}>{getEstimatedSeatingTime()}</Text>
        </View>

        {/* Join Queue Button */}
        <Pressable
          style={({ pressed }) => [
            styles.joinBtn,
            isSubmitting && styles.joinBtnDisabled,
            pressed && !isSubmitting && styles.pressed,
          ]}
          onPress={handleJoin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.joinBtnText}>Join Queue</Text>
              <Icon name="arrow-right" size={18} color="#00E599" />
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
    padding: 18,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  },
  pressed: {
    opacity: 0.8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,180,120,0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00875A',
  },
  waitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 16,
  },
  waitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waitIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#00B37E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitIconInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  waitTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  groupsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  groupsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  fastTurnBadge: {
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fastTurnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.6,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginLeft: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  helperText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  inputBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 50,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagIcon: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 8,
  },
  stepperLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#181A1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    width: 20,
    textAlign: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillBtnSelected: {
    backgroundColor: '#181A1E',
    borderColor: '#181A1E',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  customPartyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customPartyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  customPartyInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customPartyInput: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
    minWidth: 44,
  },
  customPartySuffix: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  preferenceGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  prefCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  prefCardActive: {
    backgroundColor: '#181A1E',
    borderColor: '#181A1E',
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  prefTextActive: {
    color: '#FFFFFF',
  },
  prefSub: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  prefSubActive: {
    color: '#9CA3AF',
  },
  smsNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E8FAF0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,180,120,0.2)',
    padding: 14,
    marginBottom: 16,
  },
  smsText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  estimatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  estimatedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  estimatedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#181A1E',
    borderRadius: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  joinBtnDisabled: {
    opacity: 0.7,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
