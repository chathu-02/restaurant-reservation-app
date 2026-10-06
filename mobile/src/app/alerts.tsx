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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { BottomNavBar, TabKey } from '@/components/BottomNavBar';

interface AlertItem {
  id: string;
  type: 'booking' | 'cancellation' | 'rush';
  title: string;
  subtitle: string;
  timeAgo: string;
  isUnread?: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    type: 'booking',
    title: 'New Booking',
    subtitle: 'Party of 6 at 8:00 PM',
    timeAgo: '2m ago',
    isUnread: true,
  },
  {
    id: 'a2',
    type: 'cancellation',
    title: 'Cancellation',
    subtitle: '#RB-20455',
    timeAgo: '15m ago',
    isUnread: true,
  },
  {
    id: 'a3',
    type: 'rush',
    title: 'Rush Alert',
    subtitle: '5 groups waiting',
    timeAgo: '30m ago',
  },
  {
    id: 'a4',
    type: 'booking',
    title: 'New Booking',
    subtitle: 'Party of 2 at 7:30 PM',
    timeAgo: '1h ago',
  },
  {
    id: 'a5',
    type: 'booking',
    title: 'New Booking',
    subtitle: 'Party of 4 at 6:15 PM',
    timeAgo: '3h ago',
  },
];

export default function AlertsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'booking' | 'cancellation'>('all');
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const filteredAlerts = alerts.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings') {
      router.push('/explore');
    } else if (tab === 'tables') {
      router.push('/tables');
    } else if (tab === 'waitlist') {
      router.push('/queue');
    }
  };

  const handleAlertPress = (item: AlertItem) => {
    // Mark as read
    setAlerts((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, isUnread: false } : a))
    );

    if (item.type === 'booking') {
      router.push({
        pathname: '/reservation-detail',
        params: {
          guestName: item.title === 'New Booking' ? 'Sarah Johnson' : 'Alex Miller',
          time: item.subtitle.includes('at') ? item.subtitle.split('at')[1].trim() : '8:00 PM',
          partySize: item.subtitle.includes('Party of') ? item.subtitle.split('at')[0].replace('Party of', '').trim() + ' Guests' : '4 Guests',
        },
      });
    } else if (item.type === 'rush') {
      router.push('/queue');
    } else {
      Alert.alert(
        'Cancellation Notice',
        `Reservation ${item.subtitle} was cancelled. Table released back to floor inventory.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9EC" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alerts</Text>
          <Pressable
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [styles.profileBtn, pressed && styles.pressed]}>
            <Icon name="person" size={18} color="#374151" />
          </Pressable>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'booking' as const, label: 'Bookings' },
            { key: 'cancellation' as const, label: 'Cancellations' },
          ].map((chip) => {
            const isSelected = selectedFilter === chip.key;
            return (
              <Pressable
                key={chip.key}
                onPress={() => setSelectedFilter(chip.key)}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Alerts List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {filteredAlerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="bell" size={38} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No alerts found</Text>
              <Text style={styles.emptySubtitle}>You're all caught up for this shift!</Text>
            </View>
          ) : (
            filteredAlerts.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleAlertPress(item)}
                style={({ pressed }) => [styles.alertCard, pressed && styles.pressed]}>
                {/* Left Icon */}
                <View
                  style={[
                    styles.iconBox,
                    item.type === 'booking' && styles.iconBoxBooking,
                    item.type === 'cancellation' && styles.iconBoxCancellation,
                    item.type === 'rush' && styles.iconBoxRush,
                  ]}>
                  {item.type === 'booking' ? (
                    <Icon name="calendar" size={18} color="#009669" />
                  ) : item.type === 'cancellation' ? (
                    <Icon name="close" size={18} color="#EF4444" />
                  ) : (
                    <Icon name="alert-triangle" size={18} color="#D97706" />
                  )}
                </View>

                {/* Center Content */}
                <View style={styles.contentCol}>
                  <Text style={styles.alertTitle}>{item.title}</Text>
                  <Text style={styles.alertSubtitle}>{item.subtitle}</Text>
                </View>

                {/* Right Time & Unread Indicator */}
                <View style={styles.rightCol}>
                  <Text style={styles.timeText}>{item.timeAgo}</Text>
                  {item.isUnread && <View style={styles.unreadDot} />}
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab="alerts"
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipSelected: {
    backgroundColor: '#0F172A',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 10,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxBooking: {
    backgroundColor: '#E6F8F0',
  },
  iconBoxCancellation: {
    backgroundColor: '#FFEBEB',
  },
  iconBoxRush: {
    backgroundColor: '#FEF3C7',
  },
  contentCol: {
    flex: 1,
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
