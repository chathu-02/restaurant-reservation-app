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
  onAssignTable?: () => void;
  onOfferWaitlist?: () => void;
}

export function ReservationCard({
  reservation,
  onPress,
  onSeat,
  onAssignTable,
  onOfferWaitlist,
}: ReservationCardProps) {
  const isCancelled = reservation.status === 'cancelled';
  const isSeated = reservation.status === 'seated';
  const isPending = reservation.status === 'pending';
  const isDepositDue = reservation.status === 'deposit-due';

  // Accent stripe color on left border
  const getStripeColor = () => {
    if (isCancelled) return '#9CA3AF';
    if (isSeated) return '#2563EB';
    if (isPending || isDepositDue) return '#F59E0B';
    return '#009669'; // Confirmed green
  };

  // Time formatting: split "6:00 PM" into "6:00" and "PM"
  const timeParts = reservation.time.split(' ');
  const timeNum = timeParts[0] || reservation.time;
  const timePeriod = timeParts[1] || 'PM';

  const statusInfo = RESERVATION_STATUS_CONFIG[reservation.status] || {
    label: reservation.status,
    variant: 'gray' as const,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {/* Left colored stripe */}
      <View style={[styles.leftStripe, { backgroundColor: getStripeColor() }]} />

      <View style={styles.content}>
        {/* Main Header Row: Time + Name & Badges + Status */}
        <View style={styles.topRow}>
          {/* Time Column */}
          <View style={styles.timeCol}>
            <Text style={[styles.timeText, isCancelled && styles.mutedText]}>
              {timeNum}
            </Text>
            <Text style={styles.timePeriod}>{timePeriod}</Text>
          </View>

          {/* Middle: Name + VIP badge */}
          <View style={styles.nameContainer}>
            <View style={styles.nameBadgeRow}>
              <Text
                style={[styles.guestName, isCancelled && styles.mutedText]}
                numberOfLines={1}>
                {reservation.guestName}
              </Text>
              {reservation.vipBadge && (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>{reservation.vipBadge}</Text>
                </View>
              )}
            </View>

            {/* Guests count and table assignment pill */}
            <View style={styles.detailsRow}>
              <View style={styles.guestCountItem}>
                <Icon name="person" size={13} color="#6B7280" />
                <Text style={styles.detailsText}>{reservation.partySize} guests</Text>
              </View>

              <Text style={styles.dotSeparator}>•</Text>

              {/* Table assignment box */}
              {reservation.tableNumber && reservation.tableNumber !== 'Unassigned' ? (
                <View
                  style={[
                    styles.tableBox,
                    isSeated && styles.tableBoxSeated,
                  ]}>
                  <Text
                    style={[
                      styles.tableBoxText,
                      isSeated && styles.tableBoxTextSeated,
                    ]}>
                    {reservation.tableNumber}
                    {reservation.tableArea ? ` • ${reservation.tableArea}` : ''}
                  </Text>
                </View>
              ) : (
                <View style={styles.unassignedBox}>
                  <Icon name="alert-triangle" size={11} color="#B45309" />
                  <Text style={styles.unassignedText}>Table Unassigned</Text>
                </View>
              )}
            </View>
          </View>

          {/* Right Status Badge */}
          <View style={styles.statusCol}>
            {isSeated ? (
              <View style={styles.seatedBadge}>
                <View style={styles.seatedDot} />
                <Text style={styles.seatedText}>Seated</Text>
              </View>
            ) : (
              <StatusBadge
                label={statusInfo.label}
                variant={statusInfo.variant}
                dot={!isCancelled}
              />
            )}
          </View>
        </View>

        {/* Special Row: Seated Info, Cancelled Notes, or Tags & Actions */}
        {reservation.seatedInfo ? (
          <View style={styles.seatedInfoRow}>
            <View style={styles.seatedInfoLeft}>
              <Icon name="clock" size={13} color="#2563EB" />
              <Text style={styles.seatedInfoText}>{reservation.seatedInfo}</Text>
            </View>
            <Icon name="chevron-right" size={15} color="#9CA3AF" />
          </View>
        ) : isCancelled ? (
          <View style={styles.cancelledRow}>
            <Text style={styles.cancelledSubtext}>
              {reservation.notes || 'Released table back to inventory'}
            </Text>
            <Pressable
              onPress={onOfferWaitlist}
              style={({ pressed }) => [styles.offerWaitlistBtn, pressed && styles.pressed]}>
              <Text style={styles.offerWaitlistText}>Offer to Waitlist</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.bottomRow}>
            {/* Tags (Anniversary, Window seat, etc.) */}
            <View style={styles.tagsContainer}>
              {reservation.tags?.map((tag, idx) => {
                const isAnniversary = tag.includes('Anniversary');
                const isHighChair = tag.includes('High chair');
                const isSms = tag.includes('SMS');
                const isSommelier = tag.includes('Sommelier');

                return (
                  <View
                    key={idx}
                    style={[
                      styles.tagBadge,
                      isAnniversary && styles.tagAnniversary,
                      isHighChair && styles.tagHighChair,
                      isSms && styles.tagSms,
                      isSommelier && styles.tagSommelier,
                    ]}>
                    <Text
                      style={[
                        styles.tagText,
                        isAnniversary && styles.tagTextAnniversary,
                        isHighChair && styles.tagTextHighChair,
                        isSms && styles.tagTextSms,
                        isSommelier && styles.tagTextSommelier,
                      ]}>
                      {tag}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Action buttons */}
            {reservation.actionType === 'seat' ? (
              <Pressable
                onPress={onSeat}
                style={({ pressed }) => [styles.seatGuestBtn, pressed && styles.pressed]}>
                <Text style={styles.seatGuestBtnText}>Seat Guest</Text>
                <Icon name="chevron-right" size={15} color="#FFFFFF" />
              </Pressable>
            ) : reservation.actionType === 'assign' ? (
              <Pressable
                onPress={onAssignTable}
                style={({ pressed }) => [styles.assignTableBtn, pressed && styles.pressed]}>
                <Text style={styles.assignTableBtnText}>Assign Table</Text>
              </Pressable>
            ) : (
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  leftStripe: {
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeCol: {
    minWidth: 46,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timeText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  timePeriod: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 8,
    minWidth: 0,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  guestName: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  mutedText: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  vipBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  guestCountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailsText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  tableBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tableBoxSeated: {
    backgroundColor: '#EFF6FF',
  },
  tableBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  tableBoxTextSeated: {
    color: '#1D4ED8',
  },
  unassignedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unassignedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  statusCol: {
    alignItems: 'flex-end',
  },
  seatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  seatedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  seatedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seatedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  seatedInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatedInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
  },
  cancelledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelledSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  offerWaitlistBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  offerWaitlistText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009669',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAF9',
    gap: 10,
    minHeight: 40,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  tagBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  tagAnniversary: {
    backgroundColor: '#FFE4E6',
  },
  tagTextAnniversary: {
    color: '#BE123C',
    fontWeight: '600',
  },
  tagHighChair: {
    backgroundColor: '#EEF2FF',
  },
  tagTextHighChair: {
    color: '#4F46E5',
  },
  tagSms: {
    backgroundColor: '#E6F8F0',
  },
  tagTextSms: {
    color: '#00875A',
  },
  tagSommelier: {
    backgroundColor: '#CCFBF1',
  },
  tagTextSommelier: {
    color: '#0F766E',
  },
  seatGuestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009669',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 5,
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 3,
    flexShrink: 0,
  },
  seatGuestBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  assignTableBtn: {
    backgroundColor: '#FEF9EE',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexShrink: 0,
  },
  assignTableBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#B45309',
  },
});

export default ReservationCard;
