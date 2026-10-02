import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/StatusBadge';
import ReservationCard from '@/components/ReservationCard';
import BottomNavBar, { TabKey } from '@/components/BottomNavBar';
import { useReservations } from '@/hooks/useReservations';
import { ReservationStatus } from '@/constants/status';

export default function ExploreScreen() {
  const router = useRouter();
  const { reservations, overview } = useReservations();
  const [filter, setFilter] = useState<'all' | ReservationStatus>('all');

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleSeatGuests = (guestName: string, table?: string) => {
    Alert.alert(
      'Seat Guests',
      `Seated ${guestName} at ${table || 'assigned table'}. Table status set to Occupied.`
    );
  };

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'waitlist') {
      router.push('/queue');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F8" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={20} color="#111827" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Reservations & Tables</Text>
            <Text style={styles.headerSubtitle}>
              {overview?.occupiedTables ?? 14} / {overview?.totalTables ?? 20} Tables Occupied (
              {overview?.tablesOccupancyRate ?? 70}%)
            </Text>
          </View>
          <StatusBadge label="DINNER" variant="green" dot />
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {(['all', 'confirmed', 'seated', 'completed', 'no-show'] as const).map((status) => {
              const isSelected = filter === status;
              return (
                <Pressable
                  key={status}
                  onPress={() => setFilter(status)}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}>
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Reservations List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {filteredReservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="calendar" size={40} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No reservations found</Text>
              <Text style={styles.emptySub}>No bookings in this category for tonight.</Text>
            </View>
          ) : (
            filteredReservations.map((res) => (
              <ReservationCard
                key={res.id}
                reservation={res}
                onSeat={() => handleSeatGuests(res.guestName, res.tableNumber)}
                onPress={() =>
                  Alert.alert(
                    res.guestName,
                    `Party of ${res.partySize} at ${res.time} (${res.tableNumber || 'Unassigned'})\n${
                      res.notes ? `Notes: ${res.notes}` : ''
                    }`
                  )
                }
              />
            ))
          )}
        </ScrollView>

        {/* Bottom Nav */}
        <BottomNavBar
          activeTab="bookings"
          onSelectTab={handleTabChange}
          waitlistCount={overview?.guestsInQueue ?? 4}
        />
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  filtersWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F0',
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#009669',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptySub: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
