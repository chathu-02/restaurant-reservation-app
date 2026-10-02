import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon, { IconName } from './ui/Icon';

interface ManagerToolItemProps {
  icon: IconName;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  hasActiveDot?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}

export function ManagerToolItem({
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  hasActiveDot = false,
  onPress,
  showDivider = true,
}: ManagerToolItemProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
        {/* Icon */}
        <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        {/* Active dot + Chevron */}
        <View style={styles.rightContainer}>
          {hasActiveDot && <View style={styles.activeDot} />}
          <Icon name="chevron-right" size={18} color="#9CA3AF" />
        </View>
      </Pressable>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pressed: {
    backgroundColor: '#F8FAF9',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
    marginRight: 16,
  },
});

export default ManagerToolItem;
