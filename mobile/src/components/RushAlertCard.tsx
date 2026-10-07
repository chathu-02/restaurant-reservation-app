import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from './ui/Icon';

interface RushAlertCardProps {
  time?: string;
  expectedGuests?: number;
  withinMinutes?: number;
  urgent?: boolean;
  onPressView?: () => void;
}

export function RushAlertCard({
  time = '7:30 PM',
  expectedGuests = 18,
  withinMinutes = 45,
  urgent,
  onPressView,
}: RushAlertCardProps) {
  const isUrgent = urgent !== undefined ? urgent : withinMinutes <= 60;

  return (
    <View style={[styles.card, isUrgent && styles.cardUrgent]}>
      {/* Icon */}
      <View style={[styles.iconContainer, isUrgent && styles.iconContainerUrgent]}>
        <Icon name={isUrgent ? 'alert-triangle' : 'clock'} size={22} color="#FFFFFF" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isUrgent && styles.titleUrgent]}>
          {isUrgent ? '⚠ Rush Imminent ' : 'Rush Expected '}{time}
        </Text>
        <Text style={[styles.subtitle, isUrgent && styles.subtitleUrgent]}>
          +{expectedGuests} guests expected within {withinMinutes} mins
        </Text>
      </View>

      {/* View button */}
      <Pressable
        onPress={onPressView}
        style={({ pressed }) => [
          styles.viewButton,
          isUrgent && styles.viewButtonUrgent,
          pressed && styles.viewButtonPressed,
          pressed && isUrgent && styles.viewButtonPressedUrgent,
        ]}>
        <Text style={[styles.viewText, isUrgent && styles.viewTextUrgent]}>View</Text>
        <Icon name="chevron-right" size={14} color={isUrgent ? '#991B1B' : '#78350F'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Default (orange) ────────────────────────────
  card: {
    backgroundColor: '#FFF9F3',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#F97316',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 1,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#9A3412',
    fontWeight: '500',
    lineHeight: 16,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#FED7AA',
    gap: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1.5,
  },
  viewButtonPressed: {
    opacity: 0.8,
    backgroundColor: '#FFF1E0',
  },
  viewText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#78350F',
  },

  // ── Urgent / Red (near rush hour) ───────────────
  cardUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderTopColor: '#FEE2E2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainerUrgent: {
    backgroundColor: '#DC2626',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
  titleUrgent: {
    color: '#991B1B',
    fontWeight: '700',
  },
  subtitleUrgent: {
    color: '#B91C1C',
  },
  viewButtonUrgent: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFFFF',
  },
  viewButtonPressedUrgent: {
    backgroundColor: '#FEE2E2',
  },
  viewTextUrgent: {
    color: '#991B1B',
    fontWeight: '700',
  },
});

export default RushAlertCard;
