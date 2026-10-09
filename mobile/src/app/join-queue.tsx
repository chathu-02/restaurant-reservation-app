import React, { useState } from 'react';
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
import {
  joinQueue,
  validateAndNormalizeSriLankanPhone,
  SeatingPreference,
} from '@/lib/queueService';

export default function JoinQueueScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [seatingPref, setSeatingPref] = useState<SeatingPreference>('Indoor');
  const [specialReq, setSpecialReq] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const partyPills = [2, 4, 6, 8];

  const handlePartyPillPress = (count: number) => {
    if (count === 8) {
      if (partySize < 8) {
        setPartySize(8);
      }
    } else {
      setPartySize(count);
    }
  };

  const handleCustomPartyInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (!cleaned) {
      setPartySize(8);
      return;
    }
    const val = parseInt(cleaned, 10);
    if (!isNaN(val)) {
      setPartySize(Math.max(1, Math.min(val, 50)));
    }
  };

  const handleJoin = async () => {
    if (isSubmitting) return;

    let hasError = false;

    // 1. Full name validation
    if (!fullName.trim()) {
      setNameError('Please enter your full name.');
      hasError = true;
    } else {
      setNameError(null);
    }

    // 2. Sri Lankan phone validation
    const phoneRes = validateAndNormalizeSriLankanPhone(phone);
    if (!phoneRes.isValid) {
      setPhoneError(
        phoneRes.error || 'Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567).'
      );
      hasError = true;
    } else {
      setPhoneError(null);
    }

    // 3. Party size validation
    if (partySize < 1) {
      Alert.alert('Invalid Party Size', 'Party size must be at least 1 guest.');
      return;
    }

    // 4. Seating preference check
    if (!seatingPref) {
      Alert.alert('Seating Preference Required', 'Please select your preferred seating.');
      return;
    }

    if (hasError) {
      Alert.alert(
        'Please Check Your Details',
        'Please provide a valid full name and Sri Lankan mobile number before joining the queue.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const entry = await joinQueue({
        customerName: fullName.trim(),
        phoneNumber: phoneRes.normalized,
        partySize,
        seatingPreference: seatingPref,
        specialRequests: specialReq.trim(),
      });

      router.push({
        pathname: '/queue',
        params: {
          id: entry.id,
          name: entry.customerName,
          phone: entry.phoneNumber,
          partySize: entry.partySize.toString(),
          seating: entry.seatingPreference,
          specialRequests: entry.specialRequests,
          time: entry.joinedTimeFormatted,
        },
      });
    } catch (err: any) {
      Alert.alert(
        'Unable to Join Queue',
        err?.message || 'A network error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live validation hint for phone if user has typed
  const phoneValidation = phone.trim() ? validateAndNormalizeSriLankanPhone(phone) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
              <Text style={styles.waitTitle}>Current wait ~20 min</Text>
              <View style={styles.groupsRow}>
                <Icon name="users" size={13} color="#009669" />
                <Text style={styles.groupsText}>
                  <Text style={{ fontWeight: '800', color: '#111827' }}>6 groups</Text> ahead of you
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
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <Text style={styles.requiredAsterisk}>*Required</Text>
          </View>
          <View style={[styles.inputBox, nameError ? styles.inputBoxError : null]}>
            <Icon name="person" size={18} color={nameError ? '#EF4444' : '#9CA3AF'} />
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError && text.trim()) setNameError(null);
              }}
              placeholder="e.g. Pramudi Perera"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>
          {nameError && (
            <View style={styles.errorRow}>
              <Icon name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{nameError}</Text>
            </View>
          )}
        </View>

        {/* PHONE NUMBER - Sri Lanka (+94) */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
            <Text style={styles.helperText}>Sri Lanka (For SMS updates)</Text>
          </View>
          <View style={[styles.phoneBox, phoneError ? styles.inputBoxError : null]}>
            {/* Sri Lankan Flag & Country Code Badge */}
            <View style={styles.countryBadge}>
              <Text style={styles.flagEmoji}>🇱🇰</Text>
              <Text style={styles.countryCode}>+94</Text>
            </View>
            <View style={styles.vDivider} />
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (phoneError) setPhoneError(null);
              }}
              placeholder="077 123 4567 or 771234567"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {phoneValidation?.isValid && (
              <Icon name="check" size={16} color="#00B37E" style={{ marginLeft: 6 }} />
            )}
          </View>
          {phoneError ? (
            <View style={styles.errorRow}>
              <Icon name="alert-circle" size={13} color="#EF4444" />
              <Text style={styles.errorText}>{phoneError}</Text>
            </View>
          ) : phoneValidation?.isValid ? (
            <Text style={styles.phoneValidHint}>
              Normalized: <Text style={{ fontWeight: '700' }}>{phoneValidation.formatted}</Text>
            </Text>
          ) : (
            <Text style={styles.phoneHint}>
              Accepts local formats: 071..., 077..., 076..., 074... (9 digits)
            </Text>
          )}
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
                onPress={() => setPartySize((prev) => prev + 1)}
                style={({ pressed }) => [styles.counterBtnDark, pressed && styles.pressed]}
                accessibilityLabel="Increase guests"
              >
                <Icon name="plus" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Quick pills: 2 ppl, 4 ppl, 6 ppl, 8+ ppl */}
          <View style={styles.pillsRow}>
            {partyPills.map((count) => {
              const isSelected =
                count === 8 ? partySize >= 8 : partySize === count;
              const label = count === 8 ? '8+ ppl' : `${count} ppl`;
              return (
                <Pressable
                  key={count}
                  onPress={() => handlePartyPillPress(count)}
                  style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom Party Size Input for 8+ Guests */}
          {partySize >= 8 && (
            <View style={styles.customPartyCard}>
              <View style={styles.customPartyHeader}>
                <Icon name="users" size={14} color="#009669" />
                <Text style={styles.customPartyTitle}>Large Party Specification (8+)</Text>
              </View>
              <Text style={styles.customPartySubtitle}>
                Enter exact number of guests for your party:
              </Text>
              <View style={styles.customPartyInputRow}>
                <TextInput
                  style={styles.customPartyInput}
                  value={partySize.toString()}
                  onChangeText={handleCustomPartyInput}
                  keyboardType="number-pad"
                  placeholder="8"
                  placeholderTextColor="#9CA3AF"
                  maxLength={2}
                />
                <Text style={styles.customPartySuffix}>Total Guests</Text>
              </View>
            </View>
          )}
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
              style={[
                styles.prefCard,
                seatingPref === 'Indoor' && styles.prefCardActive,
              ]}
            >
              <Icon
                name="armchair"
                size={22}
                color={seatingPref === 'Indoor' ? '#38BDF8' : '#6B7280'}
              />
              <Text
                style={[
                  styles.prefTitle,
                  seatingPref === 'Indoor' && styles.prefTextActive,
                ]}
              >
                Indoor
              </Text>
              <Text
                style={[
                  styles.prefSub,
                  seatingPref === 'Indoor' && styles.prefSubActive,
                ]}
              >
                Dining hall
              </Text>
            </Pressable>

            {/* Outdoor */}
            <Pressable
              onPress={() => setSeatingPref('Outdoor')}
              style={[
                styles.prefCard,
                seatingPref === 'Outdoor' && styles.prefCardActive,
              ]}
            >
              <Icon
                name="leaf"
                size={22}
                color={seatingPref === 'Outdoor' ? '#34D399' : '#059669'}
              />
              <Text
                style={[
                  styles.prefTitle,
                  seatingPref === 'Outdoor' && styles.prefTextActive,
                ]}
              >
                Outdoor
              </Text>
              <Text
                style={[
                  styles.prefSub,
                  seatingPref === 'Outdoor' && styles.prefSubActive,
                ]}
              >
                Garden patio
              </Text>
            </Pressable>

            {/* Any Table */}
            <Pressable
              onPress={() => setSeatingPref('Any Table')}
              style={[
                styles.prefCard,
                seatingPref === 'Any Table' && styles.prefCardActive,
              ]}
            >
              <Icon
                name="sparkles"
                size={22}
                color={seatingPref === 'Any Table' ? '#FBBF24' : '#D97706'}
              />
              <Text
                style={[
                  styles.prefTitle,
                  seatingPref === 'Any Table' && styles.prefTextActive,
                ]}
              >
                Any Table
              </Text>
              <Text
                style={[
                  styles.prefSub,
                  { color: '#009669', fontWeight: '800' },
                  seatingPref === 'Any Table' && { color: '#34D399' },
                ]}
              >
                Fastest
              </Text>
            </Pressable>
          </View>
        </View>

        {/* SPECIAL REQUESTS */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>SPECIAL REQUESTS</Text>
            <Text style={styles.helperText}>Optional</Text>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={[styles.textInput, { paddingLeft: 4 }]}
              value={specialReq}
              onChangeText={setSpecialReq}
              placeholder="e.g. High chair needed, booth if possible"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* SMS Notice */}
        <View style={styles.smsNotice}>
          <Icon name="bell" size={18} color="#009669" style={{ marginTop: 2 }} />
          <Text style={styles.smsText}>
            We'll send an SMS when your table is{' '}
            <Text style={{ fontWeight: '800' }}>5 minutes away</Text>. You won't lose your spot in line.
          </Text>
        </View>

        {/* Estimated Seating Row */}
        <View style={styles.estimatedRow}>
          <View style={styles.estimatedLeft}>
            <View style={styles.greenDot} />
            <Text style={styles.estimatedLabel}>Estimated seating time</Text>
          </View>
          <Text style={styles.estimatedTime}>~20 min wait</Text>
        </View>

        {/* Big Join Queue Button */}
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
            <>
              <ActivityIndicator size="small" color="#00E599" />
              <Text style={styles.joinBtnText}>Joining Queue...</Text>
            </>
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
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  requiredAsterisk: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
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
    paddingHorizontal: 14,
    height: 50,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: 10,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  phoneValidHint: {
    fontSize: 11,
    color: '#059669',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  phoneHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    paddingHorizontal: 4,
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
    minWidth: 20,
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
  customPartyCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  customPartyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  customPartyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  customPartySubtitle: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 8,
  },
  customPartyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customPartyInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  customPartySuffix: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
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
