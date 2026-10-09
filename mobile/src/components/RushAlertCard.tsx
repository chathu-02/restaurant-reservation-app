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
        <Icon name={isUrgent ? 'alert-triangle' : 'clock'} size={18} color="#FFFFFF" />
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
        <Icon name="chevron-right" size={13} color={isUrgent ? '#7F1D1D' : '#78350F'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Default (orange) ────────────────────────────
  card: {
    backgroundColor: '#3B1313',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#EF4444',
    borderTopColor: '#F87171',
    borderBottomColor: '#991B1B',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 1,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 10.5,
    color: '#FECDD3',
    fontWeight: '500',
    lineHeight: 14,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#FCA5A5',
    gap: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  viewButtonPressed: {
    opacity: 0.85,
    backgroundColor: '#FEE2E2',
  },
  viewText: {
    fontSize: 11,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
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
