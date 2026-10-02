import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from './ui/Icon';

interface RushAlertCardProps {
  time?: string;
  expectedGuests?: number;
  withinMinutes?: number;
  onPressView?: () => void;
}

export function RushAlertCard({
  time = '7:30 PM',
  expectedGuests = 18,
  withinMinutes = 45,
  onPressView,
}: RushAlertCardProps) {
  return (
    <View style={styles.card}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Icon name="clock" size={20} color="#FFFFFF" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Rush expected {time}</Text>
        <Text style={styles.subtitle}>
          +{expectedGuests} guests expected within {withinMinutes} mins
        </Text>
      </View>

      {/* View button */}
      <Pressable
        onPress={onPressView}
        style={({ pressed }) => [styles.viewButton, pressed && styles.viewButtonPressed]}>
        <Text style={styles.viewText}>View</Text>
        <Icon name="chevron-right" size={14} color="#78350F" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF9F3',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    marginVertical: 6,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#9A3412',
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    gap: 3,
  },
  viewButtonPressed: {
    opacity: 0.8,
    backgroundColor: '#FFF1E0',
  },
  viewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
});

export default RushAlertCard;
