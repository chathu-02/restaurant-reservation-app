import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/StatusBadge';

interface TableTile {
  id: string;
  name: string;
  seats: string;
  type: string;
  category: 'main' | 'window' | 'patio';
  isOccupied: boolean;
  occupiedLabel?: string;
}

const TABLES: TableTile[] = [
  { id: 't1', name: 'T1', seats: '2 seats', type: 'TAKEN', category: 'main', isOccupied: true, occupiedLabel: 'TAKEN' },
  { id: 't2', name: 'T2', seats: '4 seats', type: 'Window', category: 'window', isOccupied: false },
  { id: 't3', name: 'T3', seats: '4 seats', type: 'TILL 8:00', category: 'main', isOccupied: true, occupiedLabel: 'TILL 8:00' },
  { id: 't4', name: 'T4', seats: '4 seats', type: 'Booth', category: 'window', isOccupied: false },
  { id: 't5', name: 'T5', seats: '2 seats', type: 'High top', category: 'main', isOccupied: false },
  { id: 't6', name: 'T6', seats: '8 seats', type: 'Patio', category: 'patio', isOccupied: false },
  { id: 't7', name: 'T7', seats: '2 seats', type: 'TAKEN', category: 'main', isOccupied: true, occupiedLabel: 'TAKEN' },
  { id: 't8', name: 'T8', seats: '4 seats', type: 'Corner', category: 'main', isOccupied: false },
];

export default function ReservationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    guestName?: string;
    time?: string;
    partySize?: string;
    tableNumber?: string;
    tableArea?: string;
    status?: string;
  }>();

  // Dynamic state with screenshot defaults
  const reservationNumber = '#RB-20481';
  const guestName = params.guestName || 'Sarah Johnson';
  const guestVisitInfo = '3rd visit • Regular Guest';
  const guestPhone = '+1 (415) 552-0192';
  const resDate = 'Oct 24, 2024';
  const resTime = params.time || '6:00 PM';
  const partySize = params.partySize || '4 Guests';

  // Table selection state
  const [selectedTableId, setSelectedTableId] = useState('t2');
  const [tableCategoryFilter, setTableCategoryFilter] = useState<'all' | 'main' | 'window' | 'patio'>('all');
  const [currentStatus, setCurrentStatus] = useState(params.status || 'Confirmed');

  const selectedTable = TABLES.find((t) => t.id === selectedTableId) || TABLES[1];

  const filteredTables = TABLES.filter((t) => {
    if (tableCategoryFilter === 'all') return true;
    return t.category === tableCategoryFilter;
  });

  const handleSaveAssignment = () => {
    Alert.alert(
      'Table Confirmed',
      `Assigned ${selectedTable.name} (${selectedTable.type}) to ${guestName}. Notification sent to floor server Marcus D.`
    );
  };

  const handleUpdateStatus = () => {
    Alert.alert(
      'Update Reservation Status',
      'Select arrival status:',
      [
        {
          text: 'Mark Seated',
          onPress: () => {
            setCurrentStatus('Seated');
            Alert.alert('Status Updated', `${guestName} marked as Seated at ${selectedTable.name}.`);
          },
        },
        {
          text: 'Mark Arrived / In Bar',
          onPress: () => {
            setCurrentStatus('Arrived');
            Alert.alert('Status Updated', `${guestName} marked as Arrived.`);
          },
        },
        {
          text: 'Running Late',
          onPress: () => {
            setCurrentStatus('Running Late');
            Alert.alert('Status Updated', 'Added 15 min courtesy hold.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCancelReservation = () => {
    Alert.alert(
      'Cancel Reservation',
      `Are you sure you want to cancel ${reservationNumber} for ${guestName}? This will release the table back to inventory.`,
      [
        { text: 'No, Keep', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cancelled', 'Reservation cancelled and released to inventory.');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9EC" />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={20} color="#174825ff" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.resNumRow}>
              <View style={styles.activeDot} />
              <Text style={styles.resTitle}>Reservation {reservationNumber}</Text>
            </View>
            <Text style={styles.resSubtitle}>Fine Dining Host Console</Text>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              onPress={() => Alert.alert('Printing', `Printing docket ${reservationNumber} to Expo printer.`)}
              style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
              <Icon name="print" size={18} color="#4B5563" />
            </Pressable>

            <Pressable
              onPress={() =>
                Alert.alert('Reservation Options', '• Add Notes\n• Transfer to Shift\n• View History')
              }
              style={({ pressed }) => [styles.circularBtn, pressed && styles.pressed]}>
              <Icon name="more-vertical" size={18} color="#4B5563" />
            </Pressable>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Guest Profile Card */}
          <View style={styles.guestCard}>
            <View style={styles.guestTopRow}>
              {/* Avatar with online dot */}
              <View style={styles.avatarWrapper}>
                <Image
                  source={require('@/assets/images/staff_avatar.jpg')}
                  style={styles.avatar}
                  defaultSource={require('@/assets/images/icon.png')}
                />
                <View style={styles.guestOnlineDot} />
              </View>

              {/* Guest Details */}
              <View style={styles.guestInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.guestName} numberOfLines={1} ellipsizeMode="tail">
                    {guestName}
                  </Text>
                  <View style={styles.vipPill}>
                    <Text style={styles.vipPillText}>VIP</Text>
                  </View>
                </View>
                <Text style={styles.guestVisitText} numberOfLines={1}>
                  {guestVisitInfo}
                </Text>
                <Text style={styles.guestPhoneText} numberOfLines={1}>
                  {guestPhone}
                </Text>
              </View>

              {/* Status & Quick Action Buttons */}
              <View style={styles.guestRightCol}>
                <StatusBadge label={currentStatus} variant="green" dot />

                <View style={styles.contactActionsRow}>
                  <Pressable
                    onPress={() => Alert.alert('Calling Guest', `Dialing ${guestPhone}...`)}
                    style={({ pressed }) => [styles.callBtn, pressed && styles.pressed]}>
                    <Icon name="phone" size={14} color="#FFFFFF" />
                  </Pressable>

                  <Pressable
                    onPress={() => Alert.alert('SMS Sent', `SMS sent to ${guestName}: "Your table is ready!"`)}
                    style={({ pressed }) => [styles.msgBtn, pressed && styles.pressed]}>
                    <Icon name="message" size={15} color="#4B5563" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* 3 Metric Columns Row */}
            <View style={styles.metricRow}>
              <View style={styles.metricCol}>
                <View style={styles.metricLabelRow}>
                  <Icon name="calendar" size={12} color="#9CA3AF" />
                  <Text style={styles.metricLabel}>DATE</Text>
                </View>
                <Text style={styles.metricValue}>{resDate}</Text>
              </View>

              <View style={styles.metricCol}>
                <View style={styles.metricLabelRow}>
                  <Icon name="clock" size={12} color="#9CA3AF" />
                  <Text style={styles.metricLabel}>TIME</Text>
                </View>
                <Text style={styles.metricValue}>{resTime}</Text>
              </View>

              <View style={styles.metricCol}>
                <View style={styles.metricLabelRow}>
                  <Icon name="users" size={12} color="#9CA3AF" />
                  <Text style={styles.metricLabel}>PARTY</Text>
                </View>
                <Text style={styles.metricValue}>
                  {partySize.includes('Guests') ? partySize : `${partySize} Guests`}
                </Text>
              </View>
            </View>
          </View>

          {/* Special Requests & Dietary Notes Card */}
          <View style={styles.card}>
            {/* Header: section title left, allergy badge right with no overflow */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="message" size={15} color="#009669" />
                <Text style={styles.cardSectionTitle} numberOfLines={1} ellipsizeMode="tail">
                  SPECIAL REQUESTS & NOTES
                </Text>
              </View>
              <View style={styles.allergyBadge}>
                <View style={styles.allergyDot} />
                <Text style={styles.allergyText}>Severe Nut Allergy</Text>
              </View>
            </View>

            {/* Warm Cream Quote Container */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>
                <Text style={styles.quoteBold}>Guest Request: </Text>
                "Window seat preferred. Celebrating our 5th anniversary — would love a quiet corner booth if possible."
              </Text>
            </View>

            {/* Metadata Footer */}
            <View style={styles.quoteFooterRow}>
              <View style={styles.quoteFooterItem}>
                <Icon name="person" size={13} color="#009669" />
                <Text style={styles.quoteFooterText}>
                  Server: <Text style={styles.quoteFooterDark}>Marcus D.</Text>
                </Text>
              </View>
              <View style={styles.quoteFooterItem}>
                <Icon name="clock" size={13} color="#6B7280" />
                <Text style={styles.quoteFooterText}>
                  Target Turn: <Text style={styles.quoteFooterDark}>90 mins</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Assign Table Section */}
          <View style={styles.card}>
            <View style={styles.assignHeader}>
              <View style={styles.assignTopRow}>
                <Text style={styles.assignTitle}>Assign Table</Text>
                {/* Legend positioned cleanly on the right */}
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={styles.legendDotAvailable} />
                    <Text style={styles.legendText}>Available</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={styles.legendDotOccupied} />
                    <Text style={styles.legendText}>Occupied</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.assignSubtitle} numberOfLines={1}>
                Party of 4 • Min capacity 4 recommended
              </Text>
            </View>

            {/* Category Filter Tabs Scrollable */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tableTabsScrollContainer}>
              {[
                { key: 'all' as const, label: 'All Tables' },
                { key: 'main' as const, label: 'Main Dining' },
                { key: 'window' as const, label: 'Window & Booths' },
                { key: 'patio' as const, label: 'Patio' },
              ].map((tab) => {
                const isSelected = tableCategoryFilter === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => setTableCategoryFilter(tab.key)}
                    style={[styles.tableFilterPill, isSelected && styles.tableFilterPillSelected]}>
                    <Text
                      style={[
                        styles.tableFilterPillText,
                        isSelected && styles.tableFilterPillTextSelected,
                      ]}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* 4-column Table Grid */}
            <View style={styles.tableGrid}>
              {filteredTables.map((t) => {
                const isSelected = selectedTableId === t.id;
                const isOccupied = t.isOccupied;

                return (
                  <Pressable
                    key={t.id}
                    disabled={isOccupied}
                    onPress={() => setSelectedTableId(t.id)}
                    style={[
                      styles.tableCard,
                      isSelected && styles.tableCardSelected,
                      isOccupied && styles.tableCardOccupied,
                    ]}>
                    {/* Top right checkmark badge if selected */}
                    {isSelected && (
                      <View style={styles.selectedCheckBadge}>
                        <Icon name="check" size={10} color="#009669" />
                      </View>
                    )}

                    <Text
                      style={[
                        styles.tableName,
                        isSelected && styles.tableNameSelected,
                        isOccupied && styles.tableNameOccupied,
                      ]}>
                      {t.name}
                    </Text>
                    <Text
                      style={[
                        styles.tableSeats,
                        isSelected && styles.tableSeatsSelected,
                        isOccupied && styles.tableSeatsOccupied,
                      ]}>
                      {t.seats}
                    </Text>

                    {/* Tag badge inside card */}
                    <View
                      style={[
                        styles.tableTypePill,
                        isSelected && styles.tableTypePillSelected,
                        isOccupied && styles.tableTypePillOccupied,
                      ]}>
                      <Text
                        style={[
                          styles.tableTypeText,
                          isSelected && styles.tableTypeTextSelected,
                          isOccupied && styles.tableTypeTextOccupied,
                        ]}
                        numberOfLines={1}>
                        {t.type}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Bottom confirmation strip */}
            <View style={styles.tableConfirmStrip}>
              <View style={styles.tableConfirmLeft}>
                <View style={styles.confirmCircle}>
                  <Text style={styles.confirmCircleText}>{selectedTable.name}</Text>
                </View>
                <Text style={styles.confirmText}>
                  Assigned: <Text style={styles.confirmBold}>{selectedTable.type} {selectedTable.name}</Text>
                </Text>
              </View>

              <View style={styles.confirmRight}>
                <Text style={styles.confirmMatchText}>Matches</Text>
                <Icon name="check" size={14} color="#009669" />
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Sticky Action Buttons at bottom */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={handleSaveAssignment}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
            <Icon name="check" size={17} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Save & Assign Table {selectedTable.name}</Text>
          </Pressable>

          <Pressable
            onPress={handleUpdateStatus}
            style={({ pressed }) => [styles.statusBtn, pressed && styles.pressed]}>
            <Icon name="refresh" size={15} color="#374151" />
            <Text style={styles.statusBtnText}>Update Status (Seated, Late, Arrived)</Text>
          </Pressable>

          <Pressable
            onPress={handleCancelReservation}
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}>
            <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
          </Pressable>
        </View>
      </View>
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
    flex: 1,
  },
  resNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  resTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  resSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 12,
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
    overflow: 'hidden',
  },
  guestTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#009669',
  },
  guestOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  guestInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  guestVisitText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  guestPhoneText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 1,
  },
  guestRightCol: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  vipPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  vipPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  contactActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAF9',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
    overflow: 'hidden',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    minWidth: 0,
  },
  cardSectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  allergyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    flexShrink: 0,
  },
  allergyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  allergyText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  quoteBox: {
    backgroundColor: '#FEFBF3',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  quoteText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  quoteBold: {
    fontWeight: '700',
    color: '#92400E',
  },
  quoteFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  quoteFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quoteFooterText: {
    fontSize: 12,
    color: '#6B7280',
  },
  quoteFooterDark: {
    fontWeight: '600',
    color: '#111827',
  },
  assignHeader: {
    gap: 2,
  },
  assignTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assignTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  assignSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDotAvailable: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: '#0D9488',
  },
  legendDotOccupied: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#9CA3AF',
  },
  legendText: {
    fontSize: 11,
    color: '#6B7280',
  },
  tableTabsScrollContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
    paddingRight: 8,
  },
  tableFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  tableFilterPillSelected: {
    backgroundColor: '#009669',
  },
  tableFilterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  tableFilterPillTextSelected: {
    color: '#FFFFFF',
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  tableCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#009669',
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
    position: 'relative',
    gap: 1,
    marginBottom: 2,
  },
  tableCardSelected: {
    backgroundColor: '#009669',
    borderColor: '#009669',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tableCardOccupied: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  tableNameSelected: {
    color: '#FFFFFF',
  },
  tableNameOccupied: {
    color: '#9CA3AF',
  },
  tableSeats: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '500',
  },
  tableSeatsSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  tableSeatsOccupied: {
    color: '#9CA3AF',
  },
  tableTypePill: {
    marginTop: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#E6F8F0',
  },
  tableTypePillSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tableTypePillOccupied: {
    backgroundColor: '#F3F4F6',
  },
  tableTypeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#00875A',
  },
  tableTypeTextSelected: {
    color: '#FFFFFF',
  },
  tableTypeTextOccupied: {
    color: '#9CA3AF',
  },
  tableConfirmStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F8F0',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  tableConfirmLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  confirmCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmCircleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmText: {
    fontSize: 12,
    color: '#065F46',
  },
  confirmBold: {
    fontWeight: '700',
    color: '#047857',
  },
  confirmRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confirmMatchText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00875A',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    gap: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009669',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
