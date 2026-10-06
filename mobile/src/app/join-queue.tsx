import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';

export default function JoinQueueScreen() {
  const [fullName, setFullName] = useState('Alex Johnson');
  const [phone, setPhone] = useState('(555) 439-9201');
  const [partySize, setPartySize] = useState(2);
  const [seatingPref, setSeatingPref] = useState<'Indoor' | 'Outdoor' | 'Any'>('Indoor');
  const [specialReq, setSpecialReq] = useState('');

  const partyPills = [2, 4, 6, 8];

  const handleJoin = () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your full name');
      return;
    }
    Alert.alert(
      'Joined Queue!',
      `You are now in line at The Green Terrace for a party of ${partySize} (${seatingPref}). Your estimated wait is ~15 min.`,
      [{ text: 'View Queue Tracker', onPress: () => router.push('/queue') }]
    );
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
            onPress={() => router.back()}
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
          <Text style={styles.fieldLabel}>FULL NAME</Text>
          <View style={styles.inputBox}>
            <Icon name="person" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* PHONE NUMBER */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
            <Text style={styles.helperText}>For SMS updates</Text>
          </View>
          <View style={styles.phoneBox}>
            <Text style={styles.countryCode}>us +1</Text>
            <View style={styles.vDivider} />
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* PARTY SIZE */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PARTY SIZE</Text>
          <View style={styles.stepperBox}>
            <View style={styles.stepperLeft}>
              <Icon name="users" size={18} color="#9CA3AF" />
              <Text style={styles.stepperValueText}>{partySize} Guests</Text>
            </View>
            <View style={styles.counterRow}>
              <Pressable
                onPress={() => setPartySize(Math.max(1, partySize - 1))}
                style={({ pressed }) => [styles.counterBtn, pressed && styles.pressed]}
              >
                <Icon name="minus" size={14} color="#374151" />
              </Pressable>
              <Text style={styles.counterNumber}>{partySize}</Text>
              <Pressable
                onPress={() => setPartySize(partySize + 1)}
                style={({ pressed }) => [styles.counterBtnDark, pressed && styles.pressed]}
              >
                <Icon name="plus" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Quick pills */}
          <View style={styles.pillsRow}>
            {partyPills.map((count) => {
              const isSelected = partySize === count;
              const label = count === 8 ? '8+ ppl' : `${count} ppl`;
              return (
                <Pressable
                  key={count}
                  onPress={() => setPartySize(count)}
                  style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* SEATING PREFERENCE */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>SEATING PREFERENCE</Text>
            <Text style={styles.helperText}>Optional</Text>
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
              onPress={() => setSeatingPref('Any')}
              style={[styles.prefCard, seatingPref === 'Any' && styles.prefCardActive]}
            >
              <Icon
                name="sparkles"
                size={22}
                color={seatingPref === 'Any' ? '#FBBF24' : '#D97706'}
              />
              <Text style={[styles.prefTitle, seatingPref === 'Any' && styles.prefTextActive]}>
                Any table
              </Text>
              <Text
                style={[
                  styles.prefSub,
                  { color: '#009669', fontWeight: '800' },
                  seatingPref === 'Any' && { color: '#34D399' },
                ]}
              >
                Fastest
              </Text>
            </Pressable>
          </View>
        </View>

        {/* SPECIAL REQUESTS */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SPECIAL REQUESTS</Text>
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

        {/* SMS Banner */}
        <View style={styles.smsNotice}>
          <Icon name="bell" size={18} color="#009669" style={{ marginTop: 2 }} />
          <Text style={styles.smsText}>
            We'll send an SMS when your table is <Text style={{ fontWeight: '800' }}>5 minutes away</Text>. You won't lose your spot in line.
          </Text>
        </View>

        {/* Estimated Seating Row */}
        <View style={styles.estimatedRow}>
          <View style={styles.estimatedLeft}>
            <View style={styles.greenDot} />
            <Text style={styles.estimatedLabel}>Estimated seating time</Text>
          </View>
          <Text style={styles.estimatedTime}>~10:05 PM</Text>
        </View>

        {/* Big Join Queue Button */}
        <Pressable
          style={({ pressed }) => [styles.joinBtn, pressed && styles.pressed]}
          onPress={handleJoin}
        >
          <Text style={styles.joinBtnText}>Join Queue</Text>
          <Icon name="arrow-right" size={18} color="#00E599" />
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
  countryCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginRight: 12,
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
    width: 18,
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
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
