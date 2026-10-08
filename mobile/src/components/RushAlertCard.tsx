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
        <Icon name={isUrgent ? 'alert-triangle' : 'clock'} size={26} color="#FFFFFF" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isUrgent && styles.titleUrgent]}>
          {isUrgent ? 'Rush imminent ' : 'Rush expected '}{time}
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
        <Icon name="chevron-right" size={15} color={isUrgent ? '#7F1D1D' : '#78350F'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Default (orange) ────────────────────────────
  card: {
    backgroundColor: '#3B1313',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderTopColor: '#F87171',
    borderBottomColor: '#991B1B',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#FECDD3',
    fontWeight: '500',
    lineHeight: 18,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#FCA5A5',
    gap: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonPressed: {
    opacity: 0.85,
    backgroundColor: '#FEE2E2',
  },
  viewText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7F1D1D',
  },

  // ── Urgent / Red (near rush hour) ───────────────
  cardUrgent: {
    backgroundColor: '#3B1313',
    borderColor: '#EF4444',
    borderTopColor: '#F87171',
    borderBottomColor: '#991B1B',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 6,
  },
  iconContainerUrgent: {
    backgroundColor: '#EF4444',
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  titleUrgent: {
    color: '#EF4444',
    fontWeight: '800',
  },
  subtitleUrgent: {
    color: '#FECDD3',
  },
  viewButtonUrgent: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
  },
  viewButtonPressedUrgent: {
    backgroundColor: '#FEE2E2',
  },
  viewTextUrgent: {
    color: '#7F1D1D',
    fontWeight: '800',
  },
});

export default RushAlertCard;
