import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: 'ready' | 'calendar' | 'clock' | 'bell';
  badge?: string;
  ref?: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Your table is ready!',
      body: 'Please head to the host stand within 10 minutes.',
      time: '2m ago',
      unread: true,
      type: 'ready',
      badge: 'Ready now',
    },
    {
      id: '2',
      title: 'Reminder: booking tomorrow 7:00 PM',
      body: 'Table for 4 at The Green Terrace',
      time: '1h ago',
      ref: 'Booking #RB-20481',
      unread: true,
      type: 'calendar',
    },
    {
      id: '3',
      title: 'Booking time changed',
      body: 'Your reservation moved to 8:15 PM as requested.',
      time: '3h ago',
      unread: false,
      type: 'clock',
    },
    {
      id: '4',
      title: 'Booking confirmed',
      body: '#RB-20481 • 14 Jun, 6:30 PM • 4 guests',
      time: 'Yesterday',
      unread: false,
      type: 'bell',
    },
    {
      id: '5',
      title: 'Queue update',
      body: 'You moved up to position #3 in line.',
      time: 'Yesterday',
      unread: false,
      type: 'clock',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    Alert.alert('Notifications', 'All notifications marked as read.');
  };

  const handleCardTap = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.type === 'ready') {
      Alert.alert(
        'Table Ready!',
        'Table #7 is set up for your party. Please check in with host Kaweerna Sneha at the entrance.'
      );
    } else {
      Alert.alert(item.title, item.body);
    }
  };

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
            {unreadCount > 0 && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>{unreadCount} new</Text>
              </View>
            )}
          </View>

          {unreadCount > 0 ? (
            <Pressable onPress={handleMarkAllRead}>
              <Text style={styles.markReadText}>Mark all as read</Text>
            </Pressable>
          ) : (
            <Text style={styles.caughtUpText}>All read</Text>
          )}
        </View>

        {/* Section: TODAY */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>TODAY</Text>
            <Text style={styles.sectionDate}>14 Jun 2025</Text>
          </View>

          {notifications.slice(0, 3).map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.notifCard,
                item.unread && styles.notifCardUnread,
                pressed && styles.pressed,
              ]}
              onPress={() => handleCardTap(item)}
            >
              {item.unread && <View style={styles.unreadDot} />}

              <View style={styles.cardContent}>
                {/* Icon box */}
                {item.type === 'ready' ? (
                  <View style={[styles.iconBox, { backgroundColor: '#00B37E' }]}>
                    <Icon name="utensils" size={20} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={[styles.iconBox, { backgroundColor: '#181A1E' }]}>
                    <Icon
                      name={item.type === 'calendar' ? 'calendar' : 'clock'}
                      size={18}
                      color={item.type === 'calendar' ? '#34D399' : '#FBBF24'}
                    />
                  </View>
                )}

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardBody}>{item.body}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardTime}>
                      {item.time}
                      {item.ref ? ` • ${item.ref}` : ''}
                    </Text>

                    {item.badge && (
                      <View style={styles.readyBadge}>
                        <Text style={styles.readyBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Section: EARLIER */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EARLIER</Text>

          {notifications.slice(3).map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.notifCard, pressed && styles.pressed]}
              onPress={() => handleCardTap(item)}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: '#181A1E' }]}>
                  <Icon
                    name={item.type === 'bell' ? 'bell' : 'clock'}
                    size={18}
                    color="#38BDF8"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardBody}>{item.body}</Text>
                  <Text style={[styles.cardTime, { marginTop: 8 }]}>{item.time}</Text>
                </View>
              </View>
            </Pressable>
          ))}
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
