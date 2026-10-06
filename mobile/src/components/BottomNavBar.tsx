import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { IconName } from './ui/Icon';

export type TabKey = 'dashboard' | 'bookings' | 'reservations' | 'tables' | 'waitlist' | 'alerts' | 'queue';

interface BottomNavBarProps {
  activeTab?: TabKey;
  onSelectTab?: (tab: TabKey) => void;
  waitlistCount?: number;
  alertsCount?: number;
}

export function BottomNavBar({
  activeTab = 'dashboard',
  onSelectTab,
  waitlistCount = 0,
  alertsCount = 3,
}: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isCompact = width < 360;

  // Normalize active tab keys (e.g. reservations -> bookings, waitlist -> queue)
  const normalizedActiveKey =
    activeTab === 'reservations'
      ? 'bookings'
      : activeTab === 'waitlist'
      ? 'queue'
      : activeTab;

  const tabs: { key: TabKey; label: string; icon: IconName; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { key: 'bookings', label: 'Bookings', icon: 'calendar' },
    { key: 'tables', label: 'Tables', icon: 'table' },
    { key: 'queue', label: 'Queue', icon: 'users', badge: waitlistCount > 0 ? waitlistCount : undefined },
    { key: 'alerts', label: 'Alerts', icon: 'bell', badge: alertsCount },
  ];

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}>
      <View style={styles.floatingCapsule}>
        {tabs.map((tab) => {
          const isActive = normalizedActiveKey === tab.key;
          const activeIconColor = '#34D399'; // Mint green highlight icon
          const inactiveIconColor = '#64748B'; // Slate gray inactive icon

          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab?.(tab.key)}
              style={({ pressed }) => [
                styles.tabItem,
                isActive && styles.activeTabItem,
                pressed && styles.pressed,
              ]}>
              <View style={styles.iconContainer}>
                <Icon
                  name={tab.icon}
                  size={isCompact ? 19 : 21}
                  color={isActive ? activeIconColor : inactiveIconColor}
                />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  isCompact && styles.tabLabelCompact,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
  },
  floatingCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
    width: '100%',
    maxWidth: 520,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 26,
    marginHorizontal: 1,
  },
  activeTabItem: {
    backgroundColor: '#022C22', // Dark Emerald active capsule matching screenshot
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  iconContainer: {
    position: 'relative',
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeActive: {
    borderWidth: 1.5,
    borderColor: '#022C22',
  },
  badgeInactive: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
    textAlign: 'center',
  },
  tabLabelCompact: {
    fontSize: 9.5,
  },
  inactiveTabLabel: {
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});

export default BottomNavBar;
