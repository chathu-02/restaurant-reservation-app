import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from './ui/Icon';

export type TabKey = 'dashboard' | 'bookings' | 'tables' | 'waitlist' | 'alerts';

interface BottomNavBarProps {
  activeTab?: TabKey;
  onSelectTab?: (tab: TabKey) => void;
  waitlistCount?: number;
}

export function BottomNavBar({
  activeTab = 'dashboard',
  onSelectTab,
  waitlistCount = 4,
}: BottomNavBarProps) {
  const tabs = [
    { key: 'dashboard' as TabKey, label: 'Dashboard', icon: 'grid' as const },
    { key: 'bookings' as TabKey, label: 'Bookings', icon: 'calendar' as const },
    { key: 'tables' as TabKey, label: 'Tables', icon: 'clock' as const },
    {
      key: 'waitlist' as TabKey,
      label: 'Waitlist',
      icon: 'users' as const,
      badge: waitlistCount,
    },
    { key: 'alerts' as TabKey, label: 'Alerts', icon: 'bell' as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const tintColor = isActive ? '#009669' : '#9CA3AF';

          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab?.(tab.key)}
              style={styles.tabItem}>
              <View style={styles.iconContainer}>
                <Icon name={tab.icon} size={22} color={tintColor} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  { color: tintColor },
                  isActive && styles.activeTabLabel,
                ]}>
                {tab.label}
              </Text>

              {isActive && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    paddingVertical: 2,
  },
  iconContainer: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -10,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
    color: '#009669',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#009669',
    marginTop: 2,
  },
});

export default BottomNavBar;
