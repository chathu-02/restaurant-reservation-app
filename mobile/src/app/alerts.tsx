import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import BottomNavBar, { TabKey } from '@/components/BottomNavBar';
import { useReservations } from '@/hooks/useReservations';
import { useAuth } from '@/hooks/useAuth';

interface FeedAlertItem {
  id: string;
  category: 'critical' | 'booking' | 'queue' | 'special' | 'completed';
  topTags: { label: string; variant: 'red' | 'green' | 'amber' | 'orange' | 'teal' | 'gray' | 'birthday' }[];
  timeAgo: string;
  title: string;
  subtitle: string;
  badges?: string[];
  quoteText?: string;
  bottomLeftLabel?: string;
  actionButton?: {
    label: string;
    variant: 'dark' | 'green' | 'amber' | 'teal' | 'gray';
    action: () => void;
  };
  isUnread?: boolean;
}

export default function AlertsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications,
    kitchenAlerts,
    markNotificationRead,
    acknowledgeKitchenAlert,
    unreadNotificationsCount,
    overview,
  } = useReservations();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'booking' | 'cancellation'>('all');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Map Firestore notifications & kitchenAlerts into FeedAlertItem format
  const mappedAlerts: FeedAlertItem[] = React.useMemo(() => {
    const list: FeedAlertItem[] = [];

    // Include relevant kitchen alerts if unacknowledged
    kitchenAlerts.forEach((k) => {
      if (!k.acknowledged) {
        list.push({
          id: `ka-${k.id}`,
          category: 'critical',
          topTags: [{ label: 'KITCHEN ALERT 🚨', variant: 'red' }],
          timeAgo: 'Live',
          title: `Kitchen Alert (${k.type})`,
          subtitle: k.message,
          actionButton: {
            label: 'Acknowledge',
            variant: 'dark',
            action: async () => {
              await acknowledgeKitchenAlert(k.id);
            },
          },
          isUnread: true,
        });
      }
    });

    // Map Firestore notifications
    notifications.forEach((n) => {
      // Filter by recipientRole or recipientId if set
      if (n.recipientRole && user?.role && n.recipientRole !== user.role && n.recipientRole !== 'staff') {
        return;
      }
      if (n.recipientId && user?.id && n.recipientId !== user.id) {
        return;
      }

      const isCritical = n.type === 'cancellation' || n.category === 'critical';
      const isQueue = n.type === 'queue' || n.category === 'queue';

      list.push({
        id: n.id,
        category: isCritical ? 'critical' : isQueue ? 'queue' : 'booking',
        topTags: [
          {
            label: n.type ? n.type.toUpperCase() : 'NOTIFICATION',
            variant: isCritical ? 'red' : isQueue ? 'amber' : 'green',
          },
        ],
        timeAgo: 'Recent',
        title: n.title,
        subtitle: n.message,
        isUnread: !n.read,
        actionButton: {
          label: n.targetScreen ? 'View Details ->' : 'Mark Read',
          variant: isCritical ? 'dark' : 'green',
          action: async () => {
            await markNotificationRead(n.id);
            if (n.targetScreen) {
              router.push(n.targetScreen as any);
            }
          },
        },
      });
    });

    return list;
  }, [notifications, kitchenAlerts, user, acknowledgeKitchenAlert, markNotificationRead, router]);

  const filteredAlerts = mappedAlerts.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'critical') return item.category === 'critical';
    if (selectedFilter === 'booking') return item.category === 'booking';
    if (selectedFilter === 'cancellation') return item.category === 'critical';
    return true;
  });

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings' || tab === 'reservations') {
      router.push('/explore');
    } else if (tab === 'tables') {
      router.push('/tables');
    } else if (tab === 'queue' || tab === 'waitlist') {
      router.push('/queue');
    }
  };

  const getStripeColor = (category: FeedAlertItem['category']) => {
    switch (category) {
      case 'critical':
        return '#EF4444';
      case 'booking':
        return '#10B981';
      case 'queue':
        return '#F59E0B';
      case 'special':
        return '#06B6D4';
      default:
        return '#94A3B8';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Alerts Hub</Text>
            <View style={styles.liveDispatchBadge}>
              <View style={styles.liveDispatchDot} />
              <Text style={styles.liveDispatchText}>Live Dispatch</Text>
            </View>
          </View>

          {/* Right Actions Header */}
          <View style={styles.headerRightActions}>
            <Pressable style={styles.headerIconBtn}>
              <Icon name="bell" size={17} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.headerIconBtn}>
              <Icon name="clock" size={17} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={() => router.push('/profile')}
              style={styles.headerIconBtn}>
              <Icon name="person" size={17} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.headerSubtitle}>
          3 active floor alerts requiring action
        </Text>

        {/* Filter Chips Bar */}
        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}>
            {/* All */}
            <Pressable
              onPress={() => setSelectedFilter('all')}
              style={[
                styles.filterChip,
                selectedFilter === 'all' && styles.filterChipActiveAll,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'all' && styles.filterChipTextActiveAll,
                ]}>
                All <Text style={styles.countBadgeText}>5</Text>
              </Text>
            </Pressable>

            {/* Critical */}
            <Pressable
              onPress={() => setSelectedFilter('critical')}
              style={[
                styles.filterChip,
                styles.filterChipCritical,
                selectedFilter === 'critical' && styles.filterChipActiveCritical,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  styles.filterChipTextCritical,
                ]}>
                Critical <Text style={styles.countBadgeTextRed}>1</Text>
              </Text>
            </Pressable>

            {/* Bookings */}
            <Pressable
              onPress={() => setSelectedFilter('booking')}
              style={[
                styles.filterChip,
                styles.filterChipGray,
                selectedFilter === 'booking' && styles.filterChipActiveGray,
              ]}>
              <Text style={styles.filterChipTextGray}>
                Bookings <Text style={styles.countBadgeTextGray}>2</Text>
              </Text>
            </Pressable>

            {/* Cancellations */}
            <Pressable
              onPress={() => setSelectedFilter('cancellation')}
              style={[
                styles.filterChip,
                styles.filterChipGray,
                selectedFilter === 'cancellation' && styles.filterChipActiveGray,
              ]}>
              <Text style={styles.filterChipTextGray}>
                Cancellations <Text style={styles.countBadgeTextGray}>1</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Main Feed Content ScrollView */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Top Featured Dark Critical Banner */}
          {!bannerDismissed && (
            <View style={styles.criticalBanner}>
              {/* Left Accent Stripe */}
              <View style={styles.criticalStripe} />

              <View style={styles.criticalBannerContent}>
                {/* Header Tag Row */}
                <View style={styles.criticalTagRow}>
                  <View style={styles.criticalDispatchBadge}>
                    <Text style={styles.criticalDispatchText}>CRITICAL DISPATCH</Text>
                  </View>
                  <Text style={styles.tableReleasedText}>Table 12 Released</Text>
                  <Text style={styles.justNowText}>Just Now</Text>
                </View>

                {/* Main Headline */}
                <Text style={styles.criticalMainText}>
                  Table 12 cancelled • Party of 4 walk-ins waiting at the host stand
                </Text>

                {/* Subtext */}
                <Text style={styles.nextQueuedText}>
                  Next queued: <Text style={styles.nextQueuedBold}>Miller, Party of 4</Text> (waited 26m)
                </Text>

                {/* Action Buttons */}
                <View style={styles.criticalActionRow}>
                  <Pressable
                    onPress={() => {
                      Alert.alert('Immediate Seat', 'Miller (Party of 4) seated at Table 12.');
                    }}
                    style={({ pressed }) => [styles.immediateSeatBtn, pressed && styles.pressed]}>
                    <Icon name="check" size={15} color="#FFFFFF" />
                    <Text style={styles.immediateSeatText}>Immediate Seat (Miller 4p)</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setBannerDismissed(true)}
                    style={({ pressed }) => [styles.releaseBtn, pressed && styles.pressed]}>
                    <Text style={styles.releaseText}>Release</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* Section Sub-Header */}
          <View style={styles.feedSubHeader}>
            <View style={styles.feedSubHeaderLeft}>
              <Text style={styles.feedSubTitle}>LIVE ACTION FEED</Text>
              <View style={styles.autoSyncBadge}>
                <Text style={styles.autoSyncText}>AUTO-SYNC</Text>
              </View>
            </View>
            <Text style={styles.realtimeText}>🟢 Real-time</Text>
          </View>

          {/* Alert Feed Cards */}
          {filteredAlerts.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              {/* Left Accent Stripe */}
              <View
                style={[
                  styles.cardStripe,
                  { backgroundColor: getStripeColor(item.category) },
                ]}
              />

              <View style={styles.cardContent}>
                {/* Top Row: Icon + Tags + TimeAgo */}
                <View style={styles.cardTopRow}>
                  {/* Left Icon */}
                  <View
                    style={[
                      styles.cardIconBox,
                      item.category === 'critical' && styles.iconBoxCritical,
                      item.category === 'booking' && styles.iconBoxBooking,
                      item.category === 'queue' && styles.iconBoxQueue,
                      item.category === 'special' && styles.iconBoxSpecial,
                      item.category === 'completed' && styles.iconBoxCompleted,
                    ]}>
                    {item.category === 'critical' ? (
                      <Icon name="close" size={16} color="#EF4444" />
                    ) : item.category === 'booking' ? (
                      <Icon name="calendar" size={16} color="#10B981" />
                    ) : item.category === 'queue' ? (
                      <Icon name="alert-triangle" size={16} color="#F59E0B" />
                    ) : item.category === 'special' ? (
                      <Icon name="message" size={16} color="#06B6D4" />
                    ) : (
                      <Icon name="check" size={16} color="#64748B" />
                    )}
                  </View>

                  {/* Top Tags */}
                  <View style={styles.cardTagsRow}>
                    {item.topTags.map((tag, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.tagPill,
                          tag.variant === 'red' && styles.tagPillRed,
                          tag.variant === 'green' && styles.tagPillGreen,
                          tag.variant === 'amber' && styles.tagPillAmber,
                          tag.variant === 'orange' && styles.tagPillOrange,
                          tag.variant === 'teal' && styles.tagPillTeal,
                          tag.variant === 'birthday' && styles.tagPillBirthday,
                          tag.variant === 'gray' && styles.tagPillGray,
                        ]}>
                        {tag.variant === 'red' && <View style={styles.redTagDot} />}
                        <Text
                          style={[
                            styles.tagPillText,
                            tag.variant === 'red' && styles.tagTextRed,
                            tag.variant === 'green' && styles.tagTextGreen,
                            tag.variant === 'amber' && styles.tagTextAmber,
                            tag.variant === 'orange' && styles.tagTextOrange,
                            tag.variant === 'teal' && styles.tagTextTeal,
                            tag.variant === 'birthday' && styles.tagTextBirthday,
                            tag.variant === 'gray' && styles.tagTextGray,
                          ]}>
                          {tag.label}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Right Time Ago */}
                  <Text
                    style={[
                      styles.timeAgoText,
                      item.category === 'critical' && styles.timeAgoCritical,
                    ]}>
                    {item.timeAgo}
                  </Text>
                </View>

                {/* Main Card Title */}
                <Text style={styles.cardTitle}>{item.title}</Text>

                {/* Subtitle */}
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

                {/* Optional Badges (e.g. Booth Ready, 4 Seats Vacant) */}
                {item.badges && (
                  <View style={styles.badgesRow}>
                    {item.badges.map((b, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.badgePill,
                          b.includes('Booth Ready') && styles.badgeBoothReady,
                          b.includes('VIP Guest') && styles.badgeVip,
                        ]}>
                        <Text
                          style={[
                            styles.badgeText,
                            b.includes('Booth Ready') && styles.badgeTextBoothReady,
                            b.includes('VIP Guest') && styles.badgeTextVip,
                          ]}>
                          {b}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Optional Quote Box (e.g. Birthday request) */}
                {item.quoteText && (
                  <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>{item.quoteText}</Text>
                  </View>
                )}

                {/* Bottom Row: Info label on left, Action Button on right */}
                <View style={styles.cardBottomRow}>
                  {item.bottomLeftLabel ? (
                    <Text style={styles.bottomLeftLabel}>
                      {item.bottomLeftLabel}
                    </Text>
                  ) : (
                    <View />
                  )}

                  {item.actionButton && (
                    <View style={styles.actionBtnGroup}>
                      {item.category === 'critical' && (
                        <Pressable
                          onPress={() => Alert.alert('Skipped', 'Alert skipped for now.')}
                          style={({ pressed }) => [styles.skipBtn, pressed && styles.pressed]}>
                          <Text style={styles.skipBtnText}>Skip</Text>
                        </Pressable>
                      )}

                      <Pressable
                        onPress={item.actionButton.action}
                        style={({ pressed }) => [
                          styles.cardActionBtn,
                          item.actionButton?.variant === 'dark' && styles.btnDark,
                          item.actionButton?.variant === 'green' && styles.btnGreen,
                          item.actionButton?.variant === 'amber' && styles.btnAmber,
                          item.actionButton?.variant === 'teal' && styles.btnTeal,
                          pressed && styles.pressed,
                        ]}>
                        <Text
                          style={[
                            styles.cardActionBtnText,
                            item.actionButton?.variant === 'dark' && styles.btnTextDark,
                            item.actionButton?.variant === 'green' && styles.btnTextGreen,
                            item.actionButton?.variant === 'amber' && styles.btnTextAmber,
                            item.actionButton?.variant === 'teal' && styles.btnTextTeal,
                          ]}>
                          {item.actionButton.label}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavBar
          activeTab="alerts"
          onSelectTab={handleTabChange}
          waitlistCount={overview?.guestsInQueue ?? 0}
          alertsCount={unreadNotificationsCount}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F9EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#022C22',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  liveDispatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    gap: 4,
  },
  liveDispatchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveDispatchText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6.5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  filterChipActiveAll: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipCritical: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
  },
  filterChipActiveCritical: {
    backgroundColor: '#E11D48',
    borderColor: '#BE123C',
  },
  filterChipGray: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  filterChipActiveGray: {
    backgroundColor: '#334155',
    borderColor: '#334155',
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  filterChipTextActiveAll: {
    color: '#FFFFFF',
  },
  filterChipTextCritical: {
    color: '#BE123C',
  },
  filterChipTextGray: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '700',
  },
  countBadgeText: {
    fontSize: 11,
    opacity: 0.8,
  },
  countBadgeTextRed: {
    color: '#BE123C',
    fontSize: 11,
  },
  countBadgeTextGray: {
    color: '#64748B',
    fontSize: 11,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 24,
    gap: 10,
  },
  criticalBanner: {
    backgroundColor: '#022C22',
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#065F46',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  criticalStripe: {
    width: 6,
    backgroundColor: '#EF4444',
  },
  criticalBannerContent: {
    flex: 1,
    padding: 14,
  },
  criticalTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  criticalDispatchBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  criticalDispatchText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 0.4,
  },
  tableReleasedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#34D399',
    flex: 1,
  },
  justNowText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  criticalMainText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
  },
  nextQueuedText: {
    fontSize: 12,
    color: '#6EE7B7',
    marginBottom: 12,
  },
  nextQueuedBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  criticalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  immediateSeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009669',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#34D399',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
  },
  immediateSeatText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  releaseBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  releaseText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  feedSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 2,
  },
  feedSubHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedSubTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  autoSyncBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  autoSyncText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  realtimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00875A',
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardStripe: {
    width: 4.5,
  },
  cardContent: {
    flex: 1,
    padding: 13,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxCritical: {
    backgroundColor: '#FFE4E6',
  },
  iconBoxBooking: {
    backgroundColor: '#E6F8F0',
  },
  iconBoxQueue: {
    backgroundColor: '#FEF3C7',
  },
  iconBoxSpecial: {
    backgroundColor: '#CFFAFE',
  },
  iconBoxCompleted: {
    backgroundColor: '#F1F5F9',
  },
  cardTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    gap: 4,
  },
  redTagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EF4444',
  },
  tagPillRed: {
    backgroundColor: '#FFE4E6',
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tagTextRed: {
    color: '#BE123C',
    fontWeight: '800',
    fontSize: 10,
  },
  tagPillGreen: {
    backgroundColor: '#E6F8F0',
  },
  tagTextGreen: {
    color: '#00875A',
    fontWeight: '800',
    fontSize: 10,
  },
  tagPillAmber: {
    backgroundColor: '#FEF3C7',
  },
  tagTextAmber: {
    color: '#B45309',
    fontWeight: '800',
    fontSize: 10,
  },
  tagPillOrange: {
    backgroundColor: '#FFEDD5',
  },
  tagTextOrange: {
    color: '#C2410C',
    fontWeight: '800',
    fontSize: 10,
  },
  tagPillTeal: {
    backgroundColor: '#CFFAFE',
  },
  tagTextTeal: {
    color: '#0E7490',
    fontWeight: '800',
    fontSize: 10,
  },
  tagPillBirthday: {
    backgroundColor: '#FCE7F3',
  },
  tagTextBirthday: {
    color: '#BE185D',
    fontWeight: '800',
    fontSize: 10,
  },
  tagPillGray: {
    backgroundColor: '#F1F5F9',
  },
  tagTextGray: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 10,
  },
  timeAgoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  timeAgoCritical: {
    color: '#EF4444',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeBoothReady: {
    backgroundColor: '#FFE4E6',
  },
  badgeVip: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  badgeTextBoothReady: {
    color: '#BE123C',
  },
  badgeTextVip: {
    color: '#047857',
  },
  quoteBox: {
    backgroundColor: '#ECFEFF',
    padding: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFFAFE',
    marginVertical: 6,
  },
  quoteText: {
    fontSize: 12,
    color: '#0E7490',
    fontStyle: 'italic',
    lineHeight: 16,
    fontWeight: '500',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bottomLeftLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00875A',
    flex: 1,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  cardActionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  btnDark: {
    backgroundColor: '#022C22',
  },
  btnGreen: {
    backgroundColor: '#E6F8F0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  btnAmber: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  btnTeal: {
    backgroundColor: '#CFFAFE',
    borderWidth: 1,
    borderColor: '#A5F3FC',
  },
  cardActionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  btnTextDark: {
    color: '#FFFFFF',
  },
  btnTextGreen: {
    color: '#00875A',
  },
  btnTextAmber: {
    color: '#B45309',
  },
  btnTextTeal: {
    color: '#0891B2',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
