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
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  leftStripe: {
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeCol: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexShrink: 0,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 19,
  },
  timePeriod: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 10,
    minWidth: 0,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  mutedText: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  vipBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  vipText: {
    fontSize: 10.5,
    fontWeight: '800',
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
    gap: 4,
  },
  detailsText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  tableBox: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableBoxSeated: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  tableBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  tableBoxTextSeated: {
    color: '#1D4ED8',
  },
  unassignedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  unassignedText: {
    fontSize: 11,
    fontWeight: '700',
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
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  seatedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  seatedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seatedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  seatedInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatedInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  cancelledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelledSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  offerWaitlistBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  offerWaitlistText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
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
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  tagAnniversary: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
  },
  tagTextAnniversary: {
    color: '#BE123C',
    fontWeight: '700',
  },
  tagHighChair: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  tagTextHighChair: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  tagSms: {
    backgroundColor: '#E6F8F0',
    borderColor: '#A7F3D0',
  },
  tagTextSms: {
    color: '#00875A',
    fontWeight: '700',
  },
  tagSommelier: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
  },
  tagTextSommelier: {
    color: '#0F766E',
    fontWeight: '700',
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
    borderTopWidth: 1,
    borderTopColor: '#34D399',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
    flexShrink: 0,
  },
  seatGuestBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  assignTableBtn: {
    backgroundColor: '#FEF9EE',
    borderWidth: 1.2,
    borderColor: '#FDBA74',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    flexShrink: 0,
  },
  assignTableBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
  },
});

export default ReservationCard;
