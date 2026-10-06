import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { BottomNavBar, TabKey } from '@/components/BottomNavBar';

export type TableStatus = 'free' | 'busy' | 'booked' | 'dirty';

export interface FloorTable {
  id: string;
  name: string;
  seats: number;
  status: TableStatus;
  badgeText: string;
  subText: string;
  area: 'main' | 'patio' | 'bar';
  nextBookingTime?: string;
  nextBookingParty?: number;
}

const INITIAL_TABLES: FloorTable[] = [
  { id: 't1', name: 'T1', seats: 2, status: 'free', badgeText: 'Ready', subText: 'Available', area: 'main' },
  { id: 't2', name: 'T2', seats: 4, status: 'busy', badgeText: '35m', subText: '4 Guests', area: 'main' },
  { id: 't3', name: 'T3', seats: 4, status: 'booked', badgeText: '8:00p', subText: 'Miller (4)', area: 'main', nextBookingTime: '8:00 PM', nextBookingParty: 4 },
  { id: 't4', name: 'T4', seats: 2, status: 'free', badgeText: 'Ready', subText: 'Available', area: 'main' },
  { id: 't5', name: 'T5', seats: 4, status: 'free', badgeText: 'Ready', subText: 'Available', area: 'main', nextBookingTime: '8:45 PM', nextBookingParty: 4 },
  { id: 't6', name: 'T6', seats: 6, status: 'busy', badgeText: '1h 12m', subText: '5 Guests', area: 'main' },
  { id: 't7', name: 'T7', seats: 2, status: 'dirty', badgeText: 'Dirty', subText: 'Needs Turn', area: 'main' },
  { id: 't8', name: 'T8', seats: 4, status: 'free', badgeText: 'Ready', subText: 'Available', area: 'main' },
  { id: 't9', name: 'T9', seats: 6, status: 'booked', badgeText: '8:30p', subText: 'Davies (6)', area: 'main', nextBookingTime: '8:30 PM', nextBookingParty: 6 },
  { id: 't10', name: 'T10', seats: 4, status: 'busy', badgeText: '24m', subText: '3 Guests', area: 'main' },
  { id: 't11', name: 'T11', seats: 2, status: 'free', badgeText: 'Ready', subText: 'Available', area: 'main' },
  { id: 't12', name: 'T12', seats: 8, status: 'free', badgeText: 'Ready', subText: 'Available', area: 'main' },
];

export default function TablesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Responsive breakpoints
  const isCompact = width < 360;
  const isLarge = width >= 600;
  const horizontalPadding = isCompact ? 12 : 16;
  const numColumns = isLarge ? 4 : 3;
  const cardGap = 8;
  const maxContentWidth = Math.min(width, 700);
  const availableGridWidth = maxContentWidth - horizontalPadding * 2;
  const cardWidth = Math.floor((availableGridWidth - (numColumns - 1) * cardGap) / numColumns);

  const [selectedArea, setSelectedArea] = useState<'main' | 'patio' | 'bar'>('main');
  const [statusFilter, setStatusFilter] = useState<TableStatus | 'all'>('all');
  const [tables, setTables] = useState<FloorTable[]>(INITIAL_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string | null>('t5');
  const [partySize, setPartySize] = useState<number>(4);

  // Active selected table object
  const selectedTable = tables.find((t) => t.id === selectedTableId) || null;

  // Filtered tables based on area and status filter
  const displayedTables = tables.filter((t) => {
    const matchArea = t.area === selectedArea;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchArea && matchStatus;
  });

  const toggleStatusFilter = (status: TableStatus) => {
    setStatusFilter((curr) => (curr === status ? 'all' : status));
  };

  // KPI Calculations
  const freeCount = tables.filter((t) => t.status === 'free').length;
  const busyCount = tables.filter((t) => t.status === 'busy').length;
  const resCount = tables.filter((t) => t.status === 'booked').length;
  const dirtyCount = tables.filter((t) => t.status === 'dirty').length;

  // Update table status in real time
  const handleUpdateTableStatus = (status: TableStatus) => {
    if (!selectedTableId) return;

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          let badgeText = 'Ready';
          let subText = 'Available';

          if (status === 'busy') {
            badgeText = 'Just seated';
            subText = `${partySize} Guests`;
          } else if (status === 'dirty') {
            badgeText = 'Dirty';
            subText = 'Needs Turn';
          } else if (status === 'booked') {
            badgeText = 'Reserved';
            subText = 'Booked';
          }

          return {
            ...t,
            status,
            badgeText,
            subText,
          };
        }
        return t;
      })
    );

    const statusNames: Record<TableStatus, string> = {
      free: 'Available (Ready)',
      busy: 'Occupied (Seated)',
      booked: 'Reserved',
      dirty: 'Needs Cleaning',
    };

    Alert.alert('Table Updated', `${selectedTable?.name} set to ${statusNames[status]}.`);
  };

  // Bottom Navigation tab change
  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings' || tab === 'reservations') {
      router.push('/explore');
    } else if (tab === 'queue' || tab === 'waitlist') {
      router.push('/queue');
    } else if (tab === 'alerts') {
      router.push('/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Tables</Text>
              <View style={styles.peakBadge}>
                <Text style={styles.peakBadgeText}>DINNER PEAK</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>Main Dining Room • 12 tables</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.liveShiftBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveShiftText}>Live Shift</Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Table Layout Options',
                  '• Floor View: 3x4 Grid\n• Auto-Pacing Mode: ON\n• Table Turnover Alert: 90 mins'
                )
              }
              style={({ pressed }) => [styles.filterBtn, pressed && styles.pressed]}>
              <Icon name="filter" size={17} color="#4B5563" />
            </Pressable>
          </View>
        </View>

        {/* Scrollable Main Area */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Area Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.areaTabsContainer}>
            {[
              { key: 'main' as const, label: 'Main Floor (12)' },
              { key: 'patio' as const, label: 'Patio Terrace (6)' },
              { key: 'bar' as const, label: 'Bar & High-tops (8)' },
            ].map((tab) => {
              const isSelected = selectedArea === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setSelectedArea(tab.key)}
                  style={[styles.areaPill, isSelected && styles.areaPillSelected]}>
                  <Text
                    style={[
                      styles.areaPillText,
                      isSelected && styles.areaPillTextSelected,
                    ]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 4 Metric Status Cards Row - Interactive Filter Buttons */}
          <View style={styles.kpiRow}>
            {/* 1. Free / Available */}
            <Pressable
              onPress={() => toggleStatusFilter('free')}
              style={({ pressed }) => [
                styles.kpiCard,
                styles.kpiCardFree,
                statusFilter === 'free' && styles.kpiCardActiveFree,
                statusFilter !== 'all' && statusFilter !== 'free' && styles.kpiCardDimmed,
                pressed && styles.pressed,
              ]}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.kpiCount, { color: '#065F46' }]}>{freeCount} Free</Text>
                {statusFilter === 'free' && <Icon name="check" size={11} color="#065F46" />}
              </View>
              <Text style={[styles.kpiSub, { color: '#059669' }]}>Available</Text>
            </Pressable>

            {/* 2. Busy / Seated */}
            <Pressable
              onPress={() => toggleStatusFilter('busy')}
              style={({ pressed }) => [
                styles.kpiCard,
                styles.kpiCardBusy,
                statusFilter === 'busy' && styles.kpiCardActiveBusy,
                statusFilter !== 'all' && statusFilter !== 'busy' && styles.kpiCardDimmed,
                pressed && styles.pressed,
              ]}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={[styles.kpiCount, { color: '#1E40AF' }]}>{busyCount} Busy</Text>
                {statusFilter === 'busy' && <Icon name="check" size={11} color="#1E40AF" />}
              </View>
              <Text style={[styles.kpiSub, { color: '#2563EB' }]}>Seated</Text>
            </Pressable>

            {/* 3. Reserved / Booked */}
            <Pressable
              onPress={() => toggleStatusFilter('booked')}
              style={({ pressed }) => [
                styles.kpiCard,
                styles.kpiCardRes,
                statusFilter === 'booked' && styles.kpiCardActiveRes,
                statusFilter !== 'all' && statusFilter !== 'booked' && styles.kpiCardDimmed,
                pressed && styles.pressed,
              ]}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={[styles.kpiCount, { color: '#92400E' }]}>{resCount} Res</Text>
                {statusFilter === 'booked' && <Icon name="check" size={11} color="#92400E" />}
              </View>
              <Text style={[styles.kpiSub, { color: '#D97706' }]}>Booked</Text>
            </Pressable>

            {/* 4. Dirty / Cleaning */}
            <Pressable
              onPress={() => toggleStatusFilter('dirty')}
              style={({ pressed }) => [
                styles.kpiCard,
                styles.kpiCardDirty,
                statusFilter === 'dirty' && styles.kpiCardActiveDirty,
                statusFilter !== 'all' && statusFilter !== 'dirty' && styles.kpiCardDimmed,
                pressed && styles.pressed,
              ]}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiDot, { backgroundColor: '#9CA3AF' }]} />
                <Text style={[styles.kpiCount, { color: '#374151' }]}>{dirtyCount} Dirty</Text>
                {statusFilter === 'dirty' && <Icon name="check" size={11} color="#374151" />}
              </View>
              <Text style={[styles.kpiSub, { color: '#6B7280' }]}>Cleaning</Text>
            </Pressable>
          </View>

          {/* Section Heading & Capacity Badge */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle}>Main Floor Layout</Text>
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityText}>68% Capacity</Text>
              </View>
            </View>

            {statusFilter !== 'all' ? (
              <Pressable
                onPress={() => setStatusFilter('all')}
                style={({ pressed }) => [styles.clearFilterBadge, pressed && styles.pressed]}>
                <Text style={styles.clearFilterText}>
                  {statusFilter === 'free'
                    ? 'Available'
                    : statusFilter === 'busy'
                    ? 'Seated'
                    : statusFilter === 'booked'
                    ? 'Booked'
                    : 'Cleaning'}{' '}
                  ✕
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.sectionHint}>Tap table to manage</Text>
            )}
          </View>

          {/* 3-Column Table Grid or Empty Filter State */}
          {displayedTables.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="table" size={36} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No tables match this filter</Text>
              <Text style={styles.emptySub}>
                There are no {statusFilter === 'free' ? 'available' : statusFilter === 'busy' ? 'seated' : statusFilter === 'booked' ? 'booked' : 'cleaning'} tables in this section.
              </Text>
              <Pressable
                onPress={() => setStatusFilter('all')}
                style={({ pressed }) => [styles.resetFilterBtn, pressed && styles.pressed]}>
                <Text style={styles.resetFilterBtnText}>Show All Tables</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.grid}>
              {displayedTables.map((t) => {
                const isSelected = selectedTableId === t.id;
                const isFree = t.status === 'free';
                const isBusy = t.status === 'busy';
                const isBooked = t.status === 'booked';
                const isDirty = t.status === 'dirty';

                return (
                  <Pressable
                    key={t.id}
                    onPress={() => {
                      setSelectedTableId(t.id);
                      setPartySize(t.seats);
                    }}
                    style={[
                      styles.tableCard,
                      { width: cardWidth },
                      isFree && styles.cardFreeBorder,
                      isBusy && styles.cardBusyBorder,
                      isBooked && styles.cardBookedBorder,
                      isDirty && styles.cardDirtyBorder,
                      isSelected && styles.cardSelected,
                    ]}>
                  {/* Selected check badge */}
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Icon name="check" size={11} color="#009669" />
                    </View>
                  )}

                  {/* Top Status & Badge */}
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.tableStatusDot,
                        isFree && { backgroundColor: '#10B981' },
                        isBusy && { backgroundColor: '#3B82F6' },
                        isBooked && { backgroundColor: '#F59E0B' },
                        isDirty && { backgroundColor: '#9CA3AF' },
                        isSelected && { backgroundColor: '#34D399' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.cardBadgeText,
                        isFree && styles.textFree,
                        isBusy && styles.textBusy,
                        isBooked && styles.textBooked,
                        isDirty && styles.textDirty,
                        isSelected && styles.textSelected,
                      ]}
                      numberOfLines={1}>
                      {t.badgeText}
                    </Text>
                  </View>

                  {/* Table Name & Seats */}
                  <Text
                    style={[
                      styles.tableName,
                      isSelected && styles.textSelected,
                    ]}>
                    {t.name}
                  </Text>
                  <Text
                    style={[
                      styles.tableSeats,
                      isSelected && styles.textSelectedDim,
                    ]}>
                    {t.seats} seats
                  </Text>

                  {/* Subtext info */}
                  <Text
                    style={[
                      styles.cardSubText,
                      isFree && styles.textFree,
                      isBusy && styles.textBusy,
                      isBooked && styles.textBooked,
                      isDirty && styles.textDirty,
                      isSelected && styles.textSelected,
                    ]}
                    numberOfLines={1}>
                    {isSelected ? 'Selected' : t.subText}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

          {/* Interactive Floating Table Management Sheet */}
          {selectedTable && (
            <View style={styles.sheetCard}>
              {/* Top drag handle indicator */}
              <View style={styles.sheetHandle} />

              {/* Table Info Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderLeft}>
                  <View style={styles.sheetIconBox}>
                    <Icon name="table" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.sheetTitleCol}>
                    <Text style={styles.sheetTitle}>
                      {selectedTable.name} • {selectedTable.seats} seats
                    </Text>
                    <Text style={styles.sheetSubtitle}>
                      Main Floor •{' '}
                      <Text
                        style={[
                          selectedTable.status === 'free' && { color: '#009669', fontWeight: '700' },
                          selectedTable.status === 'busy' && { color: '#2563EB', fontWeight: '700' },
                          selectedTable.status === 'booked' && { color: '#D97706', fontWeight: '700' },
                          selectedTable.status === 'dirty' && { color: '#6B7280', fontWeight: '700' },
                        ]}>
                        Currently {selectedTable.status === 'free' ? 'Available' : selectedTable.status === 'busy' ? 'Occupied' : selectedTable.status === 'booked' ? 'Reserved' : 'Needs Cleaning'}
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Dismiss button */}
                <Pressable
                  onPress={() => setSelectedTableId(null)}
                  style={({ pressed }) => [styles.sheetCloseBtn, pressed && styles.pressed]}>
                  <Icon name="close" size={16} color="#6B7280" />
                </Pressable>
              </View>

              {/* Party Size Stepper */}
              <View style={styles.partyStepperRow}>
                <Text style={styles.partyLabel}>Party Size: (Max {selectedTable.seats})</Text>
                <View style={styles.stepperBox}>
                  <Pressable
                    onPress={() => setPartySize((p) => Math.max(1, p - 1))}
                    style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}>
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.stepValueText}>{partySize}</Text>
                  <Pressable
                    onPress={() => setPartySize((p) => Math.min(selectedTable.seats + 2, p + 1))}
                    style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Primary Action Button: Set Available */}
              <Pressable
                onPress={() => handleUpdateTableStatus('free')}
                style={({ pressed }) => [styles.sheetPrimaryBtn, pressed && styles.pressed]}>
                <Icon name="check" size={16} color="#FFFFFF" />
                <Text style={styles.sheetPrimaryBtnText}>Set Available</Text>
              </Pressable>

              {/* Secondary Action Buttons Row */}
              <View style={styles.sheetSecondaryRow}>
                <Pressable
                  onPress={() => handleUpdateTableStatus('busy')}
                  style={({ pressed }) => [styles.sheetSecondaryBtn, pressed && styles.pressed]}>
                  <Icon name="users" size={14} color="#374151" />
                  <Text style={styles.sheetSecondaryBtnText}>Set Occupied</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleUpdateTableStatus('dirty')}
                  style={({ pressed }) => [styles.sheetSecondaryBtn, pressed && styles.pressed]}>
                  <Icon name="refresh" size={14} color="#374151" />
                  <Text style={styles.sheetSecondaryBtnText}>Set Cleaning</Text>
                </Pressable>
              </View>

              {/* Next Booking Strip */}
              <View style={styles.nextBookingStrip}>
                <Text style={styles.nextBookingText}>
                  ⭐ Next Booking: <Text style={styles.nextBookingBold}>8:45 PM (Party of 4)</Text>
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/reservation-detail',
                      params: {
                        guestName: 'Sarah Johnson',
                        time: '8:45 PM',
                        partySize: '4 Guests',
                        tableNumber: selectedTable.name,
                      },
                    })
                  }
                  hitSlop={8}>
                  <Text style={styles.nextBookingLink}>View</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Bottom padding */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab="tables"
          onSelectTab={handleTabChange}
          waitlistCount={4}
        />
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
    backgroundColor: '#F4F9EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#022C22',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  peakBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  peakBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#34D399',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveShiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveShiftText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 12,
  },

  // Area Tabs
  areaTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  areaPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  areaPillSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  areaPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4B5563',
  },
  areaPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // KPI Row
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  kpiCard: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  kpiCardFree: {
    backgroundColor: '#E6F8F0',
    borderColor: '#A7F3D0',
  },
  kpiCardBusy: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  kpiCardRes: {
    backgroundColor: '#FEF9EE',
    borderColor: '#FDE68A',
  },
  kpiCardDirty: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  kpiCardActiveFree: {
    borderColor: '#059669',
    borderWidth: 2,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  kpiCardActiveBusy: {
    borderColor: '#2563EB',
    borderWidth: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  kpiCardActiveRes: {
    borderColor: '#D97706',
    borderWidth: 2,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  kpiCardActiveDirty: {
    borderColor: '#4B5563',
    borderWidth: 2,
    shadowColor: '#4B5563',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  kpiCardDimmed: {
    opacity: 0.45,
  },
  clearFilterBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  emptySub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 17,
  },
  resetFilterBtn: {
    marginTop: 6,
    backgroundColor: '#009669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetFilterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  kpiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  kpiCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  kpiSub: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  capacityBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  capacityText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0369A1',
  },
  sectionHint: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  // Responsive Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
    minHeight: 88,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardFreeBorder: {
    borderColor: '#A7F3D0',
  },
  cardBusyBorder: {
    borderColor: '#BFDBFE',
  },
  cardBookedBorder: {
    borderColor: '#FDE68A',
  },
  cardDirtyBorder: {
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  cardSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    justifyContent: 'space-between',
  },
  tableStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  tableName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  tableSeats: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardSubText: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
  },
  textFree: {
    color: '#00875A',
  },
  textBusy: {
    color: '#2563EB',
  },
  textBooked: {
    color: '#D97706',
  },
  textDirty: {
    color: '#6B7280',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textSelectedDim: {
    color: 'rgba(255, 255, 255, 0.75)',
  },

  // Floating Table Management Sheet
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    gap: 12,
    marginTop: 6,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sheetIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitleCol: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  sheetSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
  sheetCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  partyLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4B5563',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 18,
  },
  stepValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    minWidth: 16,
    textAlign: 'center',
  },
  sheetPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
    height: 44,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  sheetPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sheetSecondaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sheetSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 5,
    paddingHorizontal: 4,
  },
  sheetSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flexShrink: 1,
  },
  nextBookingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  nextBookingText: {
    fontSize: 11.5,
    color: '#4B5563',
  },
  nextBookingBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  nextBookingLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
