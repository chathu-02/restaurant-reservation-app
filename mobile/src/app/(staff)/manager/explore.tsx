import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Pressable,
  Platform,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/StatusBadge';
import ReservationCard from '@/components/ReservationCard';
import BottomNavBar, { TabKey } from '@/components/BottomNavBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useReservations } from '@/hooks/useReservations';
import { Reservation } from '@/services/reservation.service';
import { ReservationStatus } from '@/constants/status';
import { dateValue, prettyDate } from '@/lib/booking';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/components/logo';
import { BRAND } from '@/lib/brand';

interface DayItem {
  id: string;
  dateStr: string;
  dayName: string;
  dayNum: string;
  pax: string;
  count: number;
}

const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function ReservationsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [profilePic, setProfilePic] = React.useState('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256');

  React.useEffect(() => {
    if (user?.id) {
      AsyncStorage.getItem(`@profile_pic_${user.id}`).then(pic => {
        if (pic) setProfilePic(pic);
      });
    }
  }, [user?.id]);

  const {
    reservations,
    addBooking,
    seatReservation,
    cancelReservation,
    updateReservationStatus,
    unreadNotificationsCount,
    overview,
  } = useReservations();

  // Selected date filter ('all' or 'YYYY-MM-DD')
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [customInputDate, setCustomInputDate] = useState('');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Status Filter
  const [activeFilter, setActiveFilter] = useState<'all' | ReservationStatus>('all');

  // Dynamic Date Items for the horizontal date strip
  const dateItems = useMemo<DayItem[]>(() => {
    const today = new Date();
    const todayStr = dateValue(today);

    const totalPaxAll = reservations.reduce((acc, r) => acc + (r.partySize || 0), 0);
    const items: DayItem[] = [
      {
        id: 'all',
        dateStr: 'all',
        dayName: 'ALL',
        dayNum: 'ALL',
        pax: `${totalPaxAll} pax`,
        count: reservations.length,
      },
    ];

    const generatedDates = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const ds = dateValue(d);
      generatedDates.add(ds);

      const dayName = i === 0 ? 'TODAY' : i === 1 ? 'TOM' : DAYS_SHORT[d.getDay()];
      const dayNum = String(d.getDate()).padStart(2, '0');

      const dateRes = reservations.filter(
        (r) => (r.date || todayStr) === ds || (i === 0 && r.date === 'Today')
      );
      const paxCount = dateRes.reduce((acc, r) => acc + (r.partySize || 0), 0);

      items.push({
        id: ds,
        dateStr: ds,
        dayName,
        dayNum,
        pax: `${paxCount} pax`,
        count: dateRes.length,
      });
    }

    // Include any extra unique dates in reservations that are not in next 7 days
    reservations.forEach((r) => {
      if (
        r.date &&
        r.date !== 'Today' &&
        !generatedDates.has(r.date) &&
        r.date.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        generatedDates.add(r.date);
        const [y, m, d] = r.date.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const dayName = DAYS_SHORT[dt.getDay()] || 'DATE';
        const dayNum = String(d).padStart(2, '0');

        const dateRes = reservations.filter((res) => res.date === r.date);
        const paxCount = dateRes.reduce((acc, res) => acc + (res.partySize || 0), 0);

        items.push({
          id: r.date,
          dateStr: r.date,
          dayName,
          dayNum,
          pax: `${paxCount} pax`,
          count: dateRes.length,
        });
      }
    });

    return items;
  }, [reservations]);

  // Local display list backed by real-time hook
  const displayReservations = reservations;

  // Assign Table Modal state
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedResForTable, setSelectedResForTable] = useState<Reservation | null>(null);

  // New Reservation Modal state
  const [newResModalVisible, setNewResModalVisible] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newPartySize, setNewPartySize] = useState('2');
  const [newTime, setNewTime] = useState('7:30 PM');
  const [newTable, setNewTable] = useState('Table 5');
  const [newNotes, setNewNotes] = useState('');

  // Derived counts
  const totalCount = displayReservations.length;
  const confirmedCount = displayReservations.filter((r) => r.status === 'confirmed').length;
  const pendingCount = displayReservations.filter((r) => r.status === 'pending' || r.status === 'deposit-due').length;
  const seatedCount = displayReservations.filter((r) => r.status === 'seated').length;
  const cancelledCount = displayReservations.filter((r) => r.status === 'cancelled').length;

  // Filtered reservations based on date filter, search query, and status filter
  const filteredReservations = useMemo(() => {
    const todayStr = dateValue(new Date());

    return displayReservations.filter((r) => {
      // Date filter
      if (selectedDate !== 'all') {
        const rDate = r.date || todayStr;
        if (selectedDate === todayStr) {
          if (rDate !== todayStr && rDate !== 'Today') return false;
        } else if (rDate !== selectedDate) {
          return false;
        }
      }

      // Status filter
      if (activeFilter !== 'all') {
        if (activeFilter === 'pending') {
          if (r.status !== 'pending' && r.status !== 'deposit-due') return false;
        } else if (r.status !== activeFilter) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = r.guestName.toLowerCase().includes(query);
        const matchesTable = (r.tableNumber || '').toLowerCase().includes(query);
        const matchesArea = (r.tableArea || '').toLowerCase().includes(query);
        const matchesPhone = (r.phone || '').toLowerCase().includes(query);
        return matchesName || matchesTable || matchesArea || matchesPhone;
      }

      return true;
    });
  }, [displayReservations, selectedDate, activeFilter, searchQuery]);

  // Action: Seat guest
  const handleSeatGuest = async (res: Reservation) => {
    try {
      await seatReservation(res.id, res.tableNumber);
      Alert.alert('Guest Seated', `${res.guestName} seated at ${res.tableNumber || 'Table 12'}.`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to seat guest');
    }
  };

  // Action: Open Assign Table
  const handleOpenAssignTable = (res: Reservation) => {
    setSelectedResForTable(res);
    setAssignModalVisible(true);
  };

  // Action: Save assigned table
  const handleSelectTable = async (table: string, area: string) => {
    if (!selectedResForTable) return;
    try {
      await updateReservationStatus(selectedResForTable.id, {
        tableNumber: table,
        tableNames: [table],
        tableArea: area,
        status: 'confirmed',
      });
      setAssignModalVisible(false);
      Alert.alert('Table Assigned', `${selectedResForTable.guestName} assigned to ${table} (${area}).`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to assign table');
    }
  };

  // Action: Offer to waitlist
  const handleOfferWaitlist = (res: Reservation) => {
    Alert.alert(
      'Offered to Waitlist',
      `Table released from ${res.guestName}. Automatic notification sent to waitlist party.`
    );
  };

  // Action: Create reservation
  const handleCreateReservation = async () => {
    if (!newGuestName.trim()) {
      Alert.alert('Required', 'Please enter guest name');
      return;
    }
    try {
      await addBooking({
        guestName: newGuestName.trim(),
        partySize: parseInt(newPartySize, 10) || 2,
        time: newTime,
        tableNumber: newTable,
        tableArea: 'Dining',
        status: 'confirmed',
        notes: newNotes,
      });
      setNewGuestName('');
      setNewNotes('');
      setNewResModalVisible(false);
      Alert.alert('Booking Confirmed', `Reservation added for ${newGuestName}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create reservation');
    }
  };

  // Bottom navigation change
  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/(staff)/manager');
    } else if (tab === 'tables') {
      router.push('/(staff)/manager/tables');
    } else if (tab === 'queue' || tab === 'waitlist') {
      router.push('/(staff)/manager/queue');
    } else if (tab === 'alerts') {
      router.push('/(staff)/manager/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View style={[styles.headerLeft, { flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]}>
            {/* Logo and Brand */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Logo size={32} badge />
            </View>

            {/* Title + LIVE badge + Subtitle */}
            <View style={styles.titleContainer}>
              <View style={styles.titleBadgeRow}>
                <Text style={styles.headerTitle}>Reservations</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>• Dinner Service • 18:00 - 23:00</Text>
            </View>
          </View>

          {/* Right: + Button and Avatar */}
          <View style={styles.headerRight}>
            <Pressable
              onPress={() => setNewResModalVisible(true)}
              style={({ pressed }) => [styles.addResButton, pressed && styles.pressed]}>
              <Icon name="plus" size={18} color="#FFFFFF" />
            </Pressable>

            <Pressable
              onPress={() => router.push('/(staff)/manager/profile' as never)}
              style={styles.avatarWrapper}>
              <Image source={{ uri: profilePic }} style={styles.avatarIconCircle} />
              <View style={styles.onlineBadge} />
            </Pressable>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Tonight's Pacing Strip */}


          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#475569" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search guest, phone, or table..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color="#374151" />
              </Pressable>
            ) : (
              <View style={styles.searchRightIcons}>
                <Icon name="mic" size={19} color="#374151" />
                <Pressable
                  onPress={() => setDateModalVisible(true)}>
                  <Icon name="filter" size={19} color="#374151" />
                </Pressable>
              </View>
            )}
          </View>

          {/* Active Date Filter Banner if specific date selected */}
          {selectedDate !== 'all' && (
            <View style={styles.activeDateBanner}>
              <Icon name="calendar" size={14} color="#009669" />
              <Text style={styles.activeDateBannerText}>
                Showing: <Text style={{ fontWeight: '700' }}>{selectedDate === dateValue(new Date()) ? 'Today' : prettyDate(selectedDate)}</Text> ({filteredReservations.length} bookings)
              </Text>
              <Pressable
                onPress={() => setSelectedDate('all')}
                style={styles.clearDateBtn}>
                <Text style={styles.clearDateBtnText}>Clear</Text>
                <Icon name="close" size={12} color="#009669" />
              </Pressable>
            </View>
          )}

          {/* Horizontal Date Picker Strip */}
          <View style={styles.daysScrollWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}>
              {dateItems.map((day) => {
                const isSelected = selectedDate === day.dateStr;
                return (
                  <Pressable
                    key={day.id}
                    onPress={() => setSelectedDate(day.dateStr)}
                    style={[styles.dayCard, isSelected && styles.dayCardSelected]}>
                    <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                      {day.dayName}
                    </Text>
                    <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                      {day.dayNum}
                    </Text>
                    <Text style={[styles.dayPax, isSelected && styles.dayPaxSelected]}>
                      {day.pax}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Status Filter Chips Row */}
          <View style={styles.statusChipsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statusChipsContainer}>
              {/* All */}
              <Pressable
                onPress={() => setActiveFilter('all')}
                style={[
                  styles.filterPill,
                  styles.pillAll,
                  activeFilter === 'all' && styles.pillAllActive,
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    styles.pillAllText,
                    activeFilter === 'all' && styles.pillAllTextActive,
                  ]}>
                  All {totalCount}
                </Text>
              </Pressable>

              {/* Confirmed */}
              <Pressable
                onPress={() => setActiveFilter('confirmed')}
                style={[
                  styles.filterPill,
                  styles.pillConfirmed,
                  activeFilter === 'confirmed' && styles.pillConfirmedActive,
                ]}>
                <Text style={[styles.filterPillText, styles.pillConfirmedText]}>
                  Confirmed {confirmedCount}
                </Text>
              </Pressable>

              {/* Pending */}
              <Pressable
                onPress={() => setActiveFilter('pending')}
                style={[
                  styles.filterPill,
                  styles.pillPending,
                  activeFilter === 'pending' && styles.pillPendingActive,
                ]}>
                <Text style={[styles.filterPillText, styles.pillPendingText]}>
                  Pending {pendingCount}
                </Text>
              </Pressable>

              {/* Seated */}
              <Pressable
                onPress={() => setActiveFilter('seated')}
                style={[
                  styles.filterPill,
                  styles.pillSeated,
                  activeFilter === 'seated' && styles.pillSeatedActive,
                ]}>
                <Text style={[styles.filterPillText, styles.pillSeatedText]}>
                  Seated {seatedCount}
                </Text>
              </Pressable>

              {/* Cancelled */}
              {cancelledCount > 0 && (
                <Pressable
                  onPress={() => setActiveFilter('cancelled')}
                  style={[
                    styles.filterPill,
                    styles.pillCancelled,
                    activeFilter === 'cancelled' && styles.pillCancelledActive,
                  ]}>
                  <Text style={[styles.filterPillText, styles.pillCancelledText]}>
                    Cancelled {cancelledCount}
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </View>

          {/* Reservation Cards List */}
          <View style={styles.cardsList}>
            {filteredReservations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="calendar" size={38} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No reservations found</Text>
                <Text style={styles.emptySub}>
                  No bookings match the selected filters or search query.
                </Text>
              </View>
            ) : (
              filteredReservations.map((res) => (
                <ReservationCard
                  key={res.id}
                  reservation={res}
                  onSeat={() => handleSeatGuest(res)}
                  onAssignTable={() =>
                    router.push({
                      pathname: '/(staff)/manager/reservation-detail',
                      params: {
                        id: res.id,
                        bookingId: res.bookingId || res.id,
                        guestName: res.guestName,
                        time: res.time,
                        date: res.date || 'Today',
                        partySize: `${res.partySize} Guests`,
                        tableNumber: res.tableNumber || 'Unassigned',
                        tableArea: res.tableArea || 'Main Room',
                        phone: res.phone || '',
                        notes: res.notes || '',
                        status: res.status,
                        avatarUrl: res.avatarUrl || '',
                      },
                    })
                  }
                  onOfferWaitlist={() => handleOfferWaitlist(res)}
                  onPress={() =>
                    router.push({
                      pathname: '/(staff)/manager/reservation-detail',
                      params: {
                        id: res.id,
                        bookingId: res.bookingId || res.id,
                        guestName: res.guestName,
                        time: res.time,
                        date: res.date || 'Today',
                        partySize: `${res.partySize} Guests`,
                        tableNumber: res.tableNumber || 'Unassigned',
                        tableArea: res.tableArea || 'Main Room',
                        phone: res.phone || '',
                        notes: res.notes || '',
                        status: res.status,
                        avatarUrl: res.avatarUrl || '',
                      },
                    })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavBar
          activeTab="bookings"
          onSelectTab={handleTabChange}
          waitlistCount={overview?.guestsInQueue ?? 0}
          alertsCount={unreadNotificationsCount}
        />
      </View>

      {/* Assign Table Modal */}
      <Modal
        visible={assignModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAssignModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Assign Table for {selectedResForTable?.guestName}
              </Text>
              <Pressable onPress={() => setAssignModalVisible(false)}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Party of {selectedResForTable?.partySize} at {selectedResForTable?.time}
            </Text>

            <View style={styles.tableGrid}>
              {[
                { table: 'Table 2', area: 'Main Room', cap: '2 tops' },
                { table: 'Table 5', area: 'Main Room', cap: '2-4 tops' },
                { table: 'Table 7', area: 'Patio', cap: '2-4 tops' },
                { table: 'Table 10', area: 'Patio', cap: '4 tops' },
                { table: 'Table 14', area: 'Dining', cap: '4-6 tops' },
                { table: 'Table 16', area: 'Chef Counter', cap: '2 tops' },
              ].map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSelectTable(item.table, item.area)}
                  style={({ pressed }) => [styles.tableOption, pressed && styles.pressed]}>
                  <Icon name="table" size={20} color="#009669" />
                  <Text style={styles.tableOptionTitle}>{item.table}</Text>
                  <Text style={styles.tableOptionArea}>{item.area}</Text>
                  <Text style={styles.tableOptionCap}>{item.cap}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* New Reservation Modal */}
      <Modal
        visible={newResModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNewResModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Reservation</Text>
              <Pressable onPress={() => setNewResModalVisible(false)}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Input
              label="Guest Name"
              placeholder="e.g. William Clark"
              value={newGuestName}
              onChangeText={setNewGuestName}
              icon="person"
            />

            <View style={styles.modalRow}>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Party Size"
                  placeholder="2"
                  keyboardType="numeric"
                  value={newPartySize}
                  onChangeText={setNewPartySize}
                  icon="users"
                />
              </View>
              <View style={styles.modalHalfCol}>
                <Input
                  label="Time Slot"
                  placeholder="7:30 PM"
                  value={newTime}
                  onChangeText={setNewTime}
                  icon="clock"
                />
              </View>
            </View>

            <Input
              label="Table & Area"
              placeholder="Table 5 (Dining)"
              value={newTable}
              onChangeText={setNewTable}
              icon="table"
            />

            <Input
              label="Special Notes / VIP"
              placeholder="Window seat, Anniversary, Allergies..."
              value={newNotes}
              onChangeText={setNewNotes}
            />

            <View style={styles.modalActions}>
              <Button
                label="Cancel"
                variant="white"
                onPress={() => setNewResModalVisible(false)}
                style={styles.modalActionBtn}
              />
              <Button
                label="Confirm Booking"
                variant="primary"
                onPress={handleCreateReservation}
                style={styles.modalActionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Filter Modal */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Date</Text>
              <Pressable onPress={() => setDateModalVisible(false)}>
                <Icon name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 12 }}>
              Select a date to view reservations scheduled for that day:
            </Text>

            {/* Quick date buttons */}
            <View style={{ gap: 8, marginBottom: 16 }}>
              <Pressable
                onPress={() => {
                  setSelectedDate('all');
                  setDateModalVisible(false);
                }}
                style={[
                  styles.quickDateOption,
                  selectedDate === 'all' && styles.quickDateOptionSelected,
                ]}>
                <Icon name="calendar" size={16} color={selectedDate === 'all' ? '#009669' : '#4B5563'} />
                <Text style={[styles.quickDateOptionText, selectedDate === 'all' && styles.quickDateOptionTextSelected]}>
                  All Dates ({reservations.length} total reservations)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelectedDate(dateValue(new Date()));
                  setDateModalVisible(false);
                }}
                style={[
                  styles.quickDateOption,
                  selectedDate === dateValue(new Date()) && styles.quickDateOptionSelected,
                ]}>
                <Icon name="clock" size={16} color={selectedDate === dateValue(new Date()) ? '#009669' : '#4B5563'} />
                <Text style={[styles.quickDateOptionText, selectedDate === dateValue(new Date()) && styles.quickDateOptionTextSelected]}>
                  Today ({dateValue(new Date())})
                </Text>
              </Pressable>
            </View>

            <Input
              label="Or enter custom Date (YYYY-MM-DD)"
              placeholder="e.g. 2026-10-12"
              value={customInputDate}
              onChangeText={setCustomInputDate}
              icon="calendar"
            />

            <View style={styles.modalActions}>
              <Button
                label="Reset Filter"
                variant="white"
                onPress={() => {
                  setSelectedDate('all');
                  setCustomInputDate('');
                  setDateModalVisible(false);
                }}
                style={styles.modalActionBtn}
              />
              <Button
                label="Apply Date"
                variant="primary"
                onPress={() => {
                  if (customInputDate.trim()) {
                    setSelectedDate(customInputDate.trim());
                  }
                  setDateModalVisible(false);
                }}
                style={styles.modalActionBtn}
              />
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
    paddingVertical: 14,
    backgroundColor: '#022C22',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    flexShrink: 0,
  },
  titleContainer: {
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  liveBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#34D399',
    marginTop: 1,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addResButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#009669',
    borderWidth: 1.8,
    borderColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 10,
  },
  pacingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  pacingLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  pacingStat: {
    alignItems: 'center',
  },
  pacingNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  pacingStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  capBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  capDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00A86B',
  },
  capText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00875A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 8,
  },
  searchRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  daysScrollWrapper: {
    marginTop: 2,
  },
  daysContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  dayCard: {
    width: 54,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  dayCardSelected: {
    backgroundColor: '#009669',
    borderColor: '#007A55',
    borderTopColor: '#34D399',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dayNum: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 1,
  },
  dayNumSelected: {
    color: '#FFFFFF',
  },
  dayPax: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  dayPaxSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  statusChipsWrapper: {
    marginTop: 2,
  },
  statusChipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1.2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // All Pill
  pillAll: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
  },
  pillAllActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    borderTopColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillAllText: {
    color: '#334155',
  },
  pillAllTextActive: {
    color: '#FFFFFF',
  },
  // Confirmed Pill
  pillConfirmed: {
    backgroundColor: '#E6F8F0',
    borderColor: '#A7F3D0',
  },
  pillConfirmedActive: {
    borderColor: '#009669',
    borderWidth: 1.5,
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pillConfirmedText: {
    color: '#00875A',
  },
  // Pending Pill
  pillPending: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FDBA74',
  },
  pillPendingActive: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pillPendingText: {
    color: '#D97706',
  },
  // Seated Pill
  pillSeated: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  pillSeatedActive: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pillSeatedText: {
    color: '#1D4ED8',
  },
  // Cancelled Pill
  pillCancelled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  pillCancelledActive: {
    borderColor: '#64748B',
    borderWidth: 1.5,
  },
  pillCancelledText: {
    color: '#64748B',
  },
  cardsList: {
    marginTop: 6,
    gap: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
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
    maxHeight: '85%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tableOption: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    gap: 4,
  },
  tableOptionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  tableOptionArea: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009669',
  },
  tableOptionCap: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalHalfCol: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalActionBtn: {
    flex: 1,
  },
  activeDateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 6,
  },
  activeDateBannerText: {
    fontSize: 12.5,
    color: '#047857',
    flex: 1,
    marginLeft: 6,
  },
  clearDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  clearDateBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#009669',
  },
  quickDateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  quickDateOptionSelected: {
    backgroundColor: '#E6F8F0',
    borderColor: '#A7F3D0',
  },
  quickDateOptionText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  quickDateOptionTextSelected: {
    color: '#047857',
    fontWeight: '700',
  },
});
