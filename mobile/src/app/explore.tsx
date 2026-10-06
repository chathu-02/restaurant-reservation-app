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

interface DayItem {
  id: string;
  dayName: string;
  dayNum: string;
  pax: string;
}

const DAYS_DATA: DayItem[] = [
  { id: 'mon', dayName: 'MON', dayNum: '10', pax: '40 pax' },
  { id: 'tue', dayName: 'TUE', dayNum: '11', pax: '36 pax' },
  { id: 'wed', dayName: 'WED', dayNum: '12', pax: '44 pax' },
  { id: 'thu', dayName: 'THU', dayNum: '13', pax: '42 pax' },
  { id: 'fri', dayName: 'FRI', dayNum: '14', pax: '52 pax' },
  { id: 'sat', dayName: 'SAT', dayNum: '15', pax: '60 pax' },
];

export default function ReservationsScreen() {
  const router = useRouter();
  const { reservations, addBooking } = useReservations();

  // Selected date
  const [selectedDayId, setSelectedDayId] = useState('mon');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Status Filter
  const [activeFilter, setActiveFilter] = useState<'all' | ReservationStatus>('all');

  // Local state for dynamic live interactions
  const [localReservations, setLocalReservations] = useState<Reservation[]>([]);

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

  // Sync with hook initially if empty
  React.useEffect(() => {
    if (reservations.length > 0 && localReservations.length === 0) {
      setLocalReservations(reservations);
    }
  }, [reservations, localReservations.length]);

  // Derived counts
  const totalCount = localReservations.length;
  const confirmedCount = localReservations.filter((r) => r.status === 'confirmed').length;
  const pendingCount = localReservations.filter((r) => r.status === 'pending' || r.status === 'deposit-due').length;
  const seatedCount = localReservations.filter((r) => r.status === 'seated').length;
  const cancelledCount = localReservations.filter((r) => r.status === 'cancelled').length;

  // Filtered reservations based on search query and status filter
  const filteredReservations = useMemo(() => {
    return localReservations.filter((r) => {
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
  }, [localReservations, activeFilter, searchQuery]);

  // Action: Seat guest
  const handleSeatGuest = (res: Reservation) => {
    setLocalReservations((prev) =>
      prev.map((item) =>
        item.id === res.id
          ? {
              ...item,
              status: 'seated',
              seatedInfo: 'Seated just now • Starters ordered',
              actionType: 'seated-info',
            }
          : item
      )
    );
    Alert.alert('Guest Seated', `${res.guestName} seated at ${res.tableNumber || 'Table 12'}.`);
  };

  // Action: Open Assign Table
  const handleOpenAssignTable = (res: Reservation) => {
    setSelectedResForTable(res);
    setAssignModalVisible(true);
  };

  // Action: Save assigned table
  const handleSelectTable = (table: string, area: string) => {
    if (!selectedResForTable) return;
    setLocalReservations((prev) =>
      prev.map((item) =>
        item.id === selectedResForTable.id
          ? {
              ...item,
              tableNumber: table,
              tableArea: area,
              status: 'confirmed',
              actionType: 'seat',
            }
          : item
      )
    );
    setAssignModalVisible(false);
    Alert.alert('Table Assigned', `${selectedResForTable.guestName} assigned to ${table} (${area}).`);
  };

  // Action: Offer to waitlist
  const handleOfferWaitlist = (res: Reservation) => {
    Alert.alert(
      'Offered to Waitlist',
      `Table released from ${res.guestName}. Automatic SMS notification sent to top waitlist party.`
    );
  };

  // Action: Create reservation
  const handleCreateReservation = async () => {
    if (!newGuestName.trim()) {
      Alert.alert('Required', 'Please enter guest name');
      return;
    }
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      guestName: newGuestName.trim(),
      partySize: parseInt(newPartySize, 10) || 2,
      time: newTime,
      tableNumber: newTable,
      tableArea: 'Dining',
      status: 'confirmed',
      notes: newNotes,
      actionType: 'seat',
    };
    await addBooking(newRes);
    setLocalReservations((prev) => [newRes, ...prev]);
    setNewGuestName('');
    setNewNotes('');
    setNewResModalVisible(false);
    Alert.alert('Reservation Added', `Booking confirmed for ${newGuestName}`);
  };

  // Bottom navigation change
  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'tables') {
      router.push('/tables');
    } else if (tab === 'waitlist') {
      router.push('/queue');
    } else if (tab === 'alerts') {
      router.push('/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9EC" />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Green rounded icon */}
            <View style={styles.serviceIconContainer}>
              <Icon name="utensils" size={18} color="#FFFFFF" />
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
              onPress={() => router.push('/profile')}
              style={styles.avatarWrapper}>
              <Image
                source={require('@/assets/images/staff_avatar.jpg')}
                style={styles.avatarImage}
                defaultSource={require('@/assets/images/icon.png')}
              />
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
          <View style={styles.pacingStrip}>
            <Text style={styles.pacingLabel}>Tonight's Pacing:</Text>

            <View style={styles.pacingStat}>
              <Text style={styles.pacingNumber}>{totalCount || 42}</Text>
              <Text style={styles.pacingStatLabel}>Bookings</Text>
            </View>

            <View style={styles.pacingStat}>
              <Text style={styles.pacingNumber}>138</Text>
              <Text style={styles.pacingStatLabel}>Covers</Text>
            </View>

            <View style={styles.capBadge}>
              <View style={styles.capDot} />
              <Text style={styles.capText}>85% Cap</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search guest, phone, or table..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color="#9CA3AF" />
              </Pressable>
            ) : (
              <View style={styles.searchRightIcons}>
                <Icon name="mic" size={18} color="#9CA3AF" />
                <Pressable
                  onPress={() =>
                    Alert.alert('Filters', 'Filter by section, covers, dietary restrictions')
                  }>
                  <Icon name="filter" size={18} color="#9CA3AF" />
                </Pressable>
              </View>
            )}
          </View>

          {/* Horizontal Date Picker Strip */}
          <View style={styles.daysScrollWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}>
              {DAYS_DATA.map((day) => {
                const isSelected = selectedDayId === day.id;
                return (
                  <Pressable
                    key={day.id}
                    onPress={() => setSelectedDayId(day.id)}
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
                      pathname: '/reservation-detail',
                      params: {
                        id: res.id,
                        guestName: res.guestName,
                        time: res.time,
                        partySize: `${res.partySize} Guests`,
                        tableNumber: res.tableNumber || 'T2',
                        tableArea: res.tableArea || 'Window',
                        status:
                          res.status === 'confirmed'
                            ? 'Confirmed'
                            : res.status === 'seated'
                            ? 'Seated'
                            : 'Pending',
                      },
                    })
                  }
                  onOfferWaitlist={() => handleOfferWaitlist(res)}
                  onPress={() =>
                    router.push({
                      pathname: '/reservation-detail',
                      params: {
                        id: res.id,
                        guestName: res.guestName,
                        time: res.time,
                        partySize: `${res.partySize} Guests`,
                        tableNumber: res.tableNumber || 'T2',
                        tableArea: res.tableArea || 'Window',
                        status:
                          res.status === 'confirmed'
                            ? 'Confirmed'
                            : res.status === 'seated'
                            ? 'Seated'
                            : 'Pending',
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
          waitlistCount={2}
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
    paddingVertical: 10,
    backgroundColor: '#F4F9EC',
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
    color: '#111827',
    flexShrink: 1,
  },
  liveBadge: {
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#009669',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
    fontWeight: '400',
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
  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  pacingLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  pacingStat: {
    alignItems: 'center',
  },
  pacingNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  pacingStatLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  capBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
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
    fontWeight: '700',
    color: '#00875A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
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
    paddingVertical: 2,
  },
  dayCard: {
    width: 52,
    height: 66,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  dayCardSelected: {
    backgroundColor: '#009669',
    borderColor: '#009669',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dayNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 1,
  },
  dayNumSelected: {
    color: '#FFFFFF',
  },
  dayPax: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  dayPaxSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  statusChipsWrapper: {
    marginTop: 2,
  },
  statusChipsContainer: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // All Pill
  pillAll: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  pillAllActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  pillAllText: {
    color: '#374151',
  },
  pillAllTextActive: {
    color: '#FFFFFF',
  },
  // Confirmed Pill
  pillConfirmed: {
    backgroundColor: '#E6F8F0',
    borderColor: '#D1FAE5',
  },
  pillConfirmedActive: {
    borderColor: '#009669',
    borderWidth: 1.5,
  },
  pillConfirmedText: {
    color: '#00875A',
  },
  // Pending Pill
  pillPending: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FED7AA',
  },
  pillPendingActive: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
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
  },
  pillSeatedText: {
    color: '#1D4ED8',
  },
  // Cancelled Pill
  pillCancelled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  pillCancelledActive: {
    borderColor: '#6B7280',
    borderWidth: 1.5,
  },
  pillCancelledText: {
    color: '#6B7280',
  },
  cardsList: {
    marginTop: 4,
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
    fontWeight: '600',
    color: '#374151',
  },
  emptySub: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tableOption: {
    width: '48%',
    backgroundColor: '#F8FAF9',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    alignItems: 'center',
    gap: 4,
  },
  tableOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  tableOptionArea: {
    fontSize: 12,
    fontWeight: '500',
    color: '#009669',
  },
  tableOptionCap: {
    fontSize: 11,
    color: '#9CA3AF',
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
});
