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
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderTopColor: '#FFEDD5',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
    marginVertical: 10,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#9A3412',
    fontWeight: '500',
    lineHeight: 18,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    gap: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonPressed: {
    opacity: 0.8,
    backgroundColor: '#FFF1E0',
  },
  viewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78350F',
  },

  // ── Urgent / Red (near rush hour) ───────────────
  cardUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderTopColor: '#FEE2E2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  iconContainerUrgent: {
    backgroundColor: '#DC2626',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
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
    fontWeight: '600',
  },
});

export default RushAlertCard;
