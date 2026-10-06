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

type Timeframe = 'today' | 'week' | 'month';

export default function ReportsScreen() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<Timeframe>('today');

  // Dynamic values based on timeframe
  const metrics =
    timeframe === 'today'
      ? {
          noShowRate: '6%',
          noShowChange: 'v 1.2%',
          avgWait: '18 min',
          avgWaitSpike: '^ +4m spike',
          turnover: '3.2x',
          turnoverChange: '^ 0.4x',
          totalGuests: '412',
          guestsChange: '^ 22',
        }
      : timeframe === 'week'
      ? {
          noShowRate: '4.8%',
          noShowChange: 'v 2.1%',
          avgWait: '15 min',
          avgWaitSpike: '^ +2m spike',
          turnover: '3.5x',
          turnoverChange: '^ 0.6x',
          totalGuests: '2,840',
          guestsChange: '^ 140',
        }
      : {
          noShowRate: '5.2%',
          noShowChange: 'v 1.5%',
          avgWait: '14 min',
          avgWaitSpike: 'Stable',
          turnover: '3.4x',
          turnoverChange: '^ 0.5x',
          totalGuests: '11,450',
          guestsChange: '^ 520',
        };

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings' || tab === 'reservations') {
      router.push('/explore');
    } else if (tab === 'tables') {
      router.push('/tables');
    } else if (tab === 'queue' || tab === 'waitlist') {
      router.push('/queue');
    } else if (tab === 'alerts') {
      router.push('/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerBadgesRow}>
            <View style={styles.alertsBadge}>
              <View style={styles.redDot} />
              <Text style={styles.alertsBadgeText}>2 Alerts</Text>
            </View>

            <View style={styles.hostBadge}>
              <Text style={styles.hostBadgeText}>TACKE HOST</Text>
            </View>
          </View>
        </View>

        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Reports</Text>
          <Text style={styles.pageSubtitle}>Tacke Performance & Guest Analytics</Text>
        </View>

        {/* Timeframe Selector Pill Bar */}
        <View style={styles.timeframeRow}>
          <View style={styles.segmentedContainer}>
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'Week' },
              { key: 'month', label: 'Month' },
            ].map((tf) => {
              const isActive = timeframe === tf.key;
              return (
                <Pressable
                  key={tf.key}
                  onPress={() => setTimeframe(tf.key as Timeframe)}
                  style={[
                    styles.segmentBtn,
                    isActive && styles.segmentBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.segmentText,
                      isActive && styles.segmentTextActive,
                    ]}>
                    {tf.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* 2x2 Key Metric Cards Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              {/* Card 1: NO-SHOW RATE */}
              <View style={styles.metricCard}>
                <Text style={styles.metricCardLabel}>NO-SHOW RATE</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{metrics.noShowRate}</Text>
                  <View style={styles.greenBadge}>
                    <Text style={styles.greenBadgeText}>{metrics.noShowChange}</Text>
                  </View>
                </View>
              </View>

              {/* Card 2: AVG WAIT SPIKE */}
              <View style={styles.metricCard}>
                <View style={styles.labelWithDotRow}>
                  <Text style={styles.metricCardLabel}>AVG WAIT • SPIKE</Text>
                  <View style={styles.redDotSmall} />
                </View>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{metrics.avgWait}</Text>
                  <View style={styles.pinkBadge}>
                    <Text style={styles.pinkBadgeText}>{metrics.avgWaitSpike}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.metricsRow}>
              {/* Card 3: TABLE TURNOVER */}
              <View style={styles.metricCard}>
                <Text style={styles.metricCardLabel}>TABLE TURNOVER</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{metrics.turnover}</Text>
                  <View style={styles.greenBadge}>
                    <Text style={styles.greenBadgeText}>{metrics.turnoverChange}</Text>
                  </View>
                </View>
              </View>

              {/* Card 4: TOTAL GUESTS */}
              <View style={styles.metricCard}>
                <Text style={styles.metricCardLabel}>TOTAL GUESTS</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{metrics.totalGuests}</Text>
                  <View style={styles.greenBadge}>
                    <Text style={styles.greenBadgeText}>{metrics.guestsChange}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 1: Peak Hours Bar Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartCardHeader}>
              <View>
                <Text style={styles.chartCardTitle}>Peak hours</Text>
                <Text style={styles.chartCardSub}>Guest covers by service time</Text>
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2a5c3cff' }]} />
                  <Text style={styles.legendText}>Norm</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>Peak</Text>
                </View>
              </View>
            </View>

            {/* Custom Bar Chart Visual */}
            <View style={styles.barChartContainer}>
              {/* Y-Axis guide lines */}
              <View style={styles.yAxisGuides}>
                <Text style={styles.yAxisText}>80</Text>
                <Text style={styles.yAxisText}>60</Text>
                <Text style={styles.yAxisText}>40</Text>
                <Text style={styles.yAxisText}>20</Text>
                <Text style={styles.yAxisText}>0</Text>
              </View>

              <View style={styles.barsRow}>
                {[
                  { time: '12pm', covers: 40, heightPct: 50, isPeak: false },
                  { time: '2pm', covers: 25, heightPct: 32, isPeak: false },
                  { time: '4pm', covers: 18, heightPct: 24, isPeak: false },
                  { time: '6pm', covers: 64, heightPct: 80, isPeak: true },
                  { time: '8pm', covers: 64, heightPct: 80, isPeak: true },
                  { time: '10pm', covers: 50, heightPct: 65, isPeak: false },
                ].map((item, idx) => (
                  <View key={idx} style={styles.barCol}>
                    {item.isPeak && (
                      <View style={styles.peakBadgeTop}>
                        <Text style={styles.peakBadgeText}>{item.covers}</Text>
                      </View>
                    )}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${item.heightPct}%`,
                            backgroundColor: item.isPeak ? '#10B981' : '#1b5049ff',
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.barLabel,
                        item.isPeak && styles.barLabelPeak,
                      ]}>
                      {item.time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* SECTION 2: Wait Time Trend Line Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.chartCardTitle}>Wait time trend</Text>
                <Text style={styles.chartCardSub}>Average queue duration in minutes</Text>
              </View>

              <View style={styles.actionNeededBadge}>
                <View style={styles.redDotSmall} />
                <Text style={styles.actionNeededText}>Peak 32m · Action Needed</Text>
              </View>
            </View>

            {/* Custom Trend Visualization */}
            <View style={styles.trendChartContainer}>
              {/* Threshold reference lines */}
              <View style={styles.thresholdLineRow}>
                <Text style={styles.thresholdRedText}>31m ⚠️</Text>
                <View style={styles.thresholdDottedLineRed} />
              </View>
              <View style={[styles.thresholdLineRow, { top: 75 }]}>
                <Text style={styles.thresholdGrayText}>20m</Text>
                <View style={styles.thresholdDottedLineGray} />
              </View>
              <View style={[styles.thresholdLineRow, { top: 125 }]}>
                <Text style={styles.thresholdGrayText}>10m</Text>
                <View style={styles.thresholdDottedLineGray} />
              </View>

              {/* Curve Peak Indicator Graphic */}
              <View style={styles.curveGraphicWrapper}>
                {/* Highlighted Peak Point on Curve */}
                <View style={styles.peakPointDotRing}>
                  <View style={styles.peakPointDotInner} />
                </View>
              </View>

              {/* Time X-Axis */}
              <View style={styles.trendXAxis}>
                {['11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p'].map((t, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.trendXText,
                      t === '6p' && styles.trendXTextPeak,
                    ]}>
                    {t}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* SECTION 3: Recommendations */}
          <View style={styles.recommendationsSection}>
            <View style={styles.recHeaderRow}>
              <Text style={styles.recSectionTitle}>Recommendations</Text>
              <Pressable
                onPress={() => Alert.alert('All Recommendations', 'Showing 4 active staffing recommendations.')}
                style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
                <Text style={styles.viewAllText}>View all</Text>
                <Icon name="chevron-right" size={14} color="#009669" />
              </Pressable>
            </View>

            {/* Rec 1: Increase staff */}
            <View style={styles.urgentRecCard}>
              <View style={styles.recIconBoxRed}>
                <Icon name="clock" size={18} color="#EF4444" />
              </View>

              <View style={styles.recContent}>
                <View style={styles.recTitleRow}>
                  <Text style={styles.recTitle}>Increase staff at 6:00 PM</Text>
                  <View style={styles.urgentTag}>
                    <Text style={styles.urgentTagText}>URGENT</Text>
                  </View>
                </View>
                <Text style={styles.recDescription}>
                  Critical alert: peak wait times reached 32 mins yesterday. Add 2 floor runners to prevent bottleneck.
                </Text>
              </View>
            </View>

            {/* Rec 2: Turnover efficiency */}
            <View style={styles.normalRecCard}>
              <View style={styles.recIconBoxGreen}>
                <Icon name="flash" size={18} color="#10B981" />
              </View>

              <View style={styles.recContent}>
                <Text style={styles.recTitle}>Turnover efficiency up</Text>
                <Text style={styles.recDescription}>
                  Server team B improved table reset time by 14% this afternoon.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavBar
          activeTab="dashboard"
          onSelectTab={handleTabChange}
          waitlistCount={3}
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
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#022C22',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 4,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  alertsBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE123C',
  },
  hostBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hostBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  titleBlock: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0b5b2aff',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  timeframeRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 3,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#0b8c34ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  segmentBtnActive: {
    backgroundColor: '#04530fff',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  metricsGrid: {
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#6ecb40ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  labelWithDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricCardLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b6d31ff',
  },
  greenBadge: {
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  greenBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#00875A',
  },
  pinkBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  pinkBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  redDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  chartCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  chartCardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  yAxisGuides: {
    height: '100%',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingLeft: 6,
  },
  barCol: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 36,
  },
  peakBadgeTop: {
    backgroundColor: '#E6F8F0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  peakBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00875A',
  },
  barTrack: {
    width: 22,
    height: 105,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 6,
  },
  barLabelPeak: {
    color: '#0a6c44ff',
    fontWeight: '800',
  },
  actionNeededBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 4,
  },
  actionNeededText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  trendChartContainer: {
    height: 160,
    position: 'relative',
    marginTop: 6,
    paddingTop: 10,
  },
  thresholdLineRow: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  thresholdRedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#EF4444',
  },
  thresholdDottedLineRed: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderStyle: 'dashed',
  },
  thresholdGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  thresholdDottedLineGray: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderStyle: 'dashed',
  },
  curveGraphicWrapper: {
    position: 'absolute',
    left: 40,
    right: 10,
    top: 25,
    height: 100,
    justifyContent: 'center',
  },
  peakPointDotRing: {
    position: 'absolute',
    top: 5,
    right: 85,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  peakPointDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  trendXAxis: {
    position: 'absolute',
    bottom: 0,
    left: 35,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  trendXText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  trendXTextPeak: {
    fontWeight: '800',
    color: '#0F172A',
  },
  recommendationsSection: {
    marginTop: 4,
    gap: 8,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d4b92ff',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#009669',
  },
  urgentRecCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#FFE4E6',
    gap: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  recIconBoxRed: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recContent: {
    flex: 1,
  },
  recTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  urgentTag: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#DC2626',
  },
  recDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    fontWeight: '500',
  },
  normalRecCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopColor: '#FFFFFF',
    gap: 12,
    shadowColor: '#175b33ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  recIconBoxGreen: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E6F8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
