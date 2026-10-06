import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './ui/Icon';

export type TabKey = 'dashboard' | 'bookings' | 'reservations' | 'tables' | 'waitlist' | 'alerts';

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
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Screen size adjustments
  const isCompact = width < 360;
  const isLarge = width >= 500;

  const tabs = [
    { key: 'dashboard' as TabKey, label: 'Dashboard', icon: 'grid' as const },
    { key: 'bookings' as TabKey, label: 'Reservations', icon: 'calendar' as const },
    { key: 'tables' as TabKey, label: 'Tables', icon: 'table' as const },
    {
      key: 'waitlist' as TabKey,
      label: 'Queue',
      icon: 'users' as const,
      badge: waitlistCount,
    },
    { key: 'alerts' as TabKey, label: 'Alerts', icon: 'bell' as const },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, isCompact ? 6 : 10),
          paddingTop: isCompact ? 6 : 8,
          paddingHorizontal: isCompact ? 4 : isLarge ? 24 : 8,
        },
      ]}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const tintColor = isActive ? '#009669' : '#9CA3AF';
          const iconSize = isCompact ? 20 : 22;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab?.(tab.key)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              style={styles.tabItem}>
              <View style={styles.iconContainer}>
                <Icon name={tab.icon} size={iconSize} color={tintColor} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.tabLabel,
                  isCompact && styles.tabLabelCompact,
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
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 0,
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
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelCompact: {
    fontSize: 9.5,
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
