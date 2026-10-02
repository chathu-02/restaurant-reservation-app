import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Reservation } from '@/services/reservation.service';
import { RESERVATION_STATUS_CONFIG } from '@/constants/status';
import StatusBadge from './StatusBadge';
import Icon from './ui/Icon';

interface ReservationCardProps {
  reservation: Reservation;
  onPress?: () => void;
  onSeat?: () => void;
}

export function ReservationCard({ reservation, onPress, onSeat }: ReservationCardProps) {
  const statusInfo = RESERVATION_STATUS_CONFIG[reservation.status] || {
    label: reservation.status,
    variant: 'gray' as const,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.guestName}>{reservation.guestName}</Text>
          <StatusBadge
            label={statusInfo.label}
            variant={statusInfo.variant}
            dot={reservation.status === 'confirmed' || reservation.status === 'seated'}
          />
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="clock" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{reservation.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="users" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{reservation.partySize} guests</Text>
          </View>
          {reservation.tableNumber && (
            <View style={styles.metaItem}>
              <Icon name="table" size={14} color="#009669" />
              <Text style={[styles.metaText, styles.tableText]}>{reservation.tableNumber}</Text>
            </View>
          )}
        </View>
      </View>

      {reservation.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText} numberOfLines={2}>
            {reservation.notes}
          </Text>
        </View>
      )}

      {reservation.status === 'confirmed' && onSeat && (
        <View style={styles.actionsRow}>
          <Pressable
            onPress={onSeat}
            style={({ pressed }) => [styles.seatButton, pressed && styles.seatButtonPressed]}>
            <Icon name="check" size={14} color="#FFFFFF" />
            <Text style={styles.seatButtonText}>Seat Guests</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  tableText: {
    color: '#009669',
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F8FAF9',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  seatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009669',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  seatButtonPressed: {
    opacity: 0.85,
  },
  seatButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ReservationCard;
