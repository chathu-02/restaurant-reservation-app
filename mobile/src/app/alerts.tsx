import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.caughtUpText}>Live updates only</Text>
          </View>
          <Text style={styles.caughtUpText}>No alerts yet</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.emptyState}>
            <Icon name="bell" size={32} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No real alerts yet</Text>
            <Text style={styles.emptyBody}>
              Booking and kitchen updates will appear here when they are created.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Customer Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/(customer)/(tabs)/home' as never)}
        >
          <Icon name="utensils" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/(customer)/(tabs)/bookings' as never)}
        >
          <Icon name="calendar" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Bookings</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/queue')}>
          <Icon name="clock" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Queue</Text>
        </Pressable>
        <Pressable style={styles.navItemActive} onPress={() => {}}>
          <Icon name="bell" size={20} color="#009669" />
          <Text style={styles.navTextActive}>Alerts</Text>
          <View style={styles.activeDot} />
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/customer-profile')}>
          <Icon name="person" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
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
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  newBadge: {
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  caughtUpText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 56,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: '#6B7280',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  sectionDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 10,
    position: 'relative',
  },
  notifCardUnread: {
    borderColor: 'rgba(0,180,120,0.3)',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B37E',
  },
  pressed: {
    opacity: 0.8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    paddingRight: 12,
  },
  cardBody: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 3,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardTime: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  readyBadge: {
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  readyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F0',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navItemActive: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#009669',
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#009669',
    marginTop: 2,
  },
});
