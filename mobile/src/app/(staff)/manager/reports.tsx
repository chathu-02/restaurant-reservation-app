import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line, Text as SvgText, Rect } from 'react-native-svg';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Icon from '@/components/ui/Icon';
import { Logo } from '@/components/logo';

type TimeRange = 'weekly' | 'monthly' | 'annually';
type MetricType = 'guests' | 'revenue' | 'bookings';

interface ChartPoint {
  label: string;
  value: number;
  fullDate?: string;
  isHigh: boolean;
}

export default function ReportsScreen() {
  const router = useRouter();
  const [chartView, setChartView] = useState<TimeRange>('weekly');
  const [metricType, setMetricType] = useState<MetricType>('guests');
  const [chartWidth, setChartWidth] = useState(320);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubReservations = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      const resData: any[] = [];
      snapshot.forEach((doc) => resData.push({ id: doc.id, ...doc.data() }));
      setReservations(resData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching reservations:', err);
      setLoading(false);
    });

    const unsubExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      const expData: any[] = [];
      snapshot.forEach((doc) => expData.push({ id: doc.id, ...doc.data() }));
      setExpenses(expData);
    }, (err) => {
      console.error('Error fetching expenses:', err);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUserCount(snapshot.size);
    }, (err) => {
      console.error('Error fetching users:', err);
    });

    return () => {
      unsubReservations();
      unsubExpenses();
      unsubUsers();
    };
  }, []);

  // Compute Real Summary Metrics
  const totalGuests = reservations.reduce((sum, r) => sum + (Number(r.partySize) || 0), 0);
  const confirmedReservations = reservations.filter(r => ['confirmed', 'seated', 'served'].includes(r.status));
  const noShowReservations = reservations.filter(r => r.status === 'no_show');
  const noShowRate = reservations.length ? Math.round((noShowReservations.length / reservations.length) * 100) : 0;

  // Real revenue calculated from confirmed deposits
  const totalDepositRevenue = reservations
    .filter(r => r.depositStatus === 'received' || (r.status === 'confirmed' && r.depositAmount))
    .reduce((sum, r) => sum + (Number(r.depositAmount) || 0), 0);

  // If no deposits yet in testing, display a reasonable estimated revenue based on guests
  const estimatedRevenue = totalDepositRevenue > 0 ? totalDepositRevenue : (totalGuests * 1800);

  const totalExpenseAmount = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const reports = [
    {
      title: 'Estimated Revenue',
      value: totalDepositRevenue > 0 ? `Rs. ${totalDepositRevenue.toLocaleString()}` : `Rs. ${estimatedRevenue.toLocaleString()}`,
      trend: `${confirmedReservations.length} confirmed`,
      trendType: 'up',
      icon: 'chart' as const,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Customer Footfall',
      value: totalGuests.toLocaleString(),
      trend: `${reservations.length} total bookings`,
      trendType: 'up',
      icon: 'users' as const,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      title: 'Registered Users',
      value: userCount.toString(),
      trend: 'Active team & guests',
      trendType: 'neutral',
      icon: 'star' as const,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      title: 'No-Show Rate',
      value: `${noShowRate}%`,
      trend: `${noShowReservations.length} marked no-show`,
      trendType: noShowRate > 15 ? 'down' : 'up',
      icon: 'clock' as const,
      color: noShowRate > 15 ? '#EF4444' : '#F59E0B',
      bgColor: noShowRate > 15 ? '#FEF2F2' : '#FFFBEB',
    },
  ];

  // Process Real Data into Chart Data Points
  const getChartData = (): ChartPoint[] => {
    let rawPoints: { label: string; value: number }[] = [];

    if (chartView === 'weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayValues = [0, 0, 0, 0, 0, 0, 0];

      reservations.forEach(r => {
        if (!r.date) return;
        // Parse date string (YYYY-MM-DD)
        const dateObj = new Date(r.date);
        if (!isNaN(dateObj.getTime())) {
          // JS getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
          const dayIndex = (dateObj.getDay() + 6) % 7; // Convert to 0: Mon, 6: Sun
          const increment = metricType === 'guests'
            ? (Number(r.partySize) || 1)
            : metricType === 'revenue'
            ? (Number(r.depositAmount) || 1500)
            : 1;
          dayValues[dayIndex] += increment;
        }
      });

      rawPoints = days.map((label, idx) => ({
        label,
        value: dayValues[idx],
      }));
    } else if (chartView === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthValues = new Array(12).fill(0);

      reservations.forEach(r => {
        if (!r.date) return;
        const dateObj = new Date(r.date);
        if (!isNaN(dateObj.getTime())) {
          const m = dateObj.getMonth();
          const increment = metricType === 'guests'
            ? (Number(r.partySize) || 1)
            : metricType === 'revenue'
            ? (Number(r.depositAmount) || 1500)
            : 1;
          monthValues[m] += increment;
        }
      });

      rawPoints = months.map((label, idx) => ({
        label,
        value: monthValues[idx],
      }));
    } else {
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
      const yearValues = [0, 0, 0, 0];

      reservations.forEach(r => {
        if (!r.date) return;
        const y = new Date(r.date).getFullYear();
        const idx = years.indexOf(y);
        if (idx !== -1) {
          const increment = metricType === 'guests'
            ? (Number(r.partySize) || 1)
            : metricType === 'revenue'
            ? (Number(r.depositAmount) || 1500)
            : 1;
          yearValues[idx] += increment;
        }
      });

      rawPoints = years.map((y, idx) => ({
        label: y.toString(),
        value: yearValues[idx],
      }));
    }

    const values = rawPoints.map(p => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    // Dynamic threshold: points with values >= threshold are HIGH (Green), below are LOW (Red)
    const threshold = minVal === maxVal ? (maxVal > 0 ? maxVal * 0.5 : 1) : minVal + (maxVal - minVal) * 0.45;

    return rawPoints.map(p => ({
      ...p,
      isHigh: p.value >= threshold && p.value > 0,
    }));
  };

  const chartData = getChartData();
  const values = chartData.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values, 10); // Ensure at least a height of 10

  // Chart Geometry Coordinates
  const chartHeight = 190;
  const paddingX = 24;
  const paddingTop = 26;
  const paddingBottom = 32;
  const effectiveWidth = Math.max(chartWidth - paddingX * 2, 200);
  const effectiveHeight = chartHeight - paddingTop - paddingBottom;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * effectiveWidth;
    const ratio = maxVal === minVal ? 0.5 : (d.value - minVal) / (maxVal - minVal);
    const y = paddingTop + effectiveHeight - ratio * effectiveHeight;
    return { ...d, x, y };
  });

  const selectedPoint = selectedPointIndex !== null ? points[selectedPointIndex] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Logo size={28} badge />
          <Text style={styles.navTitle}>OceanGrace</Text>
        </View>

        <View style={styles.navRight}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/(staff)/manager/admin-notifications' as any)}>
            <Icon name="bell" size={20} color="#A7F3D0" />
            <View style={styles.notificationDot} />
          </Pressable>
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>Manager</Text>
            <View style={styles.profileAvatarPlaceholder}>
              <Icon name="person" size={16} color="#064E3B" />
            </View>
            <Icon name="chevron-down" size={16} color="#A7F3D0" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Performance Reports</Text>
          <Text style={styles.pageSubtitle}>Live analytics based on real restaurant database.</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Fetching database reports...</Text>
          </View>
        ) : (
          <>
            {/* Real Stats Grid */}
            <View style={styles.grid}>
              {reports.map((report, index) => (
                <View key={index} style={styles.reportCard}>
                  <View style={[styles.iconBox, { backgroundColor: report.bgColor }]}>
                    <Icon name={report.icon as any} size={24} color={report.color} />
                  </View>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportValue}>{report.value}</Text>
                  <View style={styles.trendRow}>
                    <Icon
                      name={report.trendType === 'up' ? 'arrow-forward' as any : report.trendType === 'down' ? 'arrow-back' as any : 'minus'}
                      size={14}
                      color={report.trendType === 'up' ? '#10B981' : report.trendType === 'down' ? '#EF4444' : '#64748B'}
                    />
                    <Text style={[styles.trendText, { color: report.trendType === 'up' ? '#10B981' : report.trendType === 'down' ? '#EF4444' : '#64748B' }]}>
                      {report.trend}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* High/Low Dynamic Line Chart Card */}
            <View
              style={styles.chartCard}
              onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
            >
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartTitle}>Trend Analytics</Text>
                  <Text style={styles.chartSubtitle}>
                    {metricType === 'guests' ? 'Guest Footfall Trend' : metricType === 'revenue' ? 'Estimated Revenue' : 'Reservations Volume'}
                  </Text>
                </View>

                {/* Period Selector Tabs */}
                <View style={styles.chartTabs}>
                  {(['weekly', 'monthly', 'annually'] as TimeRange[]).map((tab) => (
                    <Pressable
                      key={tab}
                      style={[styles.chartTab, chartView === tab && styles.chartTabActive]}
                      onPress={() => {
                        setChartView(tab);
                        setSelectedPointIndex(null);
                      }}
                    >
                      <Text style={[styles.chartTabText, chartView === tab && styles.chartTabTextActive]}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Metric Switcher Pills */}
              <View style={styles.metricSwitchContainer}>
                {(['guests', 'revenue', 'bookings'] as MetricType[]).map((m) => (
                  <Pressable
                    key={m}
                    style={[styles.metricPill, metricType === m && styles.metricPillActive]}
                    onPress={() => {
                      setMetricType(m);
                      setSelectedPointIndex(null);
                    }}
                  >
                    <Text style={[styles.metricPillText, metricType === m && styles.metricPillTextActive]}>
                      {m === 'guests' ? '👥 Guests' : m === 'revenue' ? '💰 Revenue' : '📅 Bookings'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* High vs Low Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>High Activity (Peak / Good)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>Low Activity (Dip / Below avg)</Text>
                </View>
              </View>

              {/* Selected Point Callout Tooltip */}
              {selectedPoint && (
                <View style={styles.tooltipBox}>
                  <View style={[styles.tooltipBadge, { backgroundColor: selectedPoint.isHigh ? '#ECFDF5' : '#FEF2F2' }]}>
                    <View style={[styles.legendDot, { backgroundColor: selectedPoint.isHigh ? '#10B981' : '#EF4444' }]} />
                    <Text style={[styles.tooltipBadgeText, { color: selectedPoint.isHigh ? '#065F46' : '#991B1B' }]}>
                      {selectedPoint.isHigh ? 'High Point' : 'Low Point'}
                    </Text>
                  </View>
                  <Text style={styles.tooltipLabel}>
                    {selectedPoint.label}: <Text style={styles.tooltipValue}>
                      {metricType === 'revenue' ? `Rs. ${selectedPoint.value.toLocaleString()}` : `${selectedPoint.value} ${metricType}`}
                    </Text>
                  </Text>
                </View>
              )}

              {/* SVG Line Chart Area */}
              <View style={styles.svgWrapper}>
                <Svg width={chartWidth - 40} height={chartHeight}>
                  <Defs>
                    {/* Soft gradient fill under chart */}
                    <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                      <Stop offset="80%" stopColor="#EF4444" stopOpacity="0.05" />
                      <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </LinearGradient>
                  </Defs>

                  {/* Horizontal Guideline lines */}
                  {[0.2, 0.5, 0.8].map((ratio, idx) => {
                    const lineY = paddingTop + effectiveHeight * ratio;
                    return (
                      <Line
                        key={idx}
                        x1={paddingX}
                        y1={lineY}
                        x2={chartWidth - paddingX - 40}
                        y2={lineY}
                        stroke="#E2E8F0"
                        strokeDasharray="4, 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Area Fill Underneath Line */}
                  {points.length > 1 && (
                    <Path
                      d={`M ${points[0].x} ${chartHeight - paddingBottom} ` +
                        points.map(p => `L ${p.x} ${p.y}`).join(' ') +
                        ` L ${points[points.length - 1].x} ${chartHeight - paddingBottom} Z`}
                      fill="url(#chartGradient)"
                    />
                  )}

                  {/* Dynamic Color Line Segments (Green for High, Red for Low) */}
                  {points.map((p, idx) => {
                    if (idx === points.length - 1) return null;
                    const nextP = points[idx + 1];
                    // If target or next point is low, line turns RED; if high, line is GREEN
                    const isSegmentHigh = nextP.isHigh && p.isHigh;
                    const segmentColor = isSegmentHigh ? '#10B981' : '#EF4444';

                    return (
                      <Line
                        key={`seg-${idx}`}
                        x1={p.x}
                        y1={p.y}
                        x2={nextP.x}
                        y2={nextP.y}
                        stroke={segmentColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Interactive Nodes / Data Points */}
                  {points.map((p, idx) => {
                    const isSelected = selectedPointIndex === idx;
                    const pointColor = p.isHigh ? '#10B981' : '#EF4444';
                    const haloColor = p.isHigh ? 'rgba(16, 185, 129, 0.22)' : 'rgba(239, 68, 68, 0.22)';

                    return (
                      <React.Fragment key={`pt-${idx}`}>
                        {/* Outer Glow Halo Ring */}
                        <Circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 14 : 9}
                          fill={haloColor}
                        />

                        {/* Core Dot */}
                        <Circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 6 : 4.5}
                          fill={pointColor}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />

                        {/* X-axis Label text */}
                        <SvgText
                          x={p.x}
                          y={chartHeight - 10}
                          fontSize="11"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fill={isSelected ? '#064E3B' : '#64748B'}
                          textAnchor="middle"
                        >
                          {p.label}
                        </SvgText>
                      </React.Fragment>
                    );
                  })}
                </Svg>

                {/* Touch targets over each data point for instant interactivity */}
                <View style={styles.touchOverlay} pointerEvents="box-none">
                  {points.map((p, idx) => (
                    <Pressable
                      key={`touch-${idx}`}
                      style={[
                        styles.touchArea,
                        { left: p.x - 18, top: p.y - 18 }
                      ]}
                      onPress={() => setSelectedPointIndex(idx === selectedPointIndex ? null : idx)}
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.chartFootnote}>
                💡 Tap on any point to view exact figures. High metrics appear in <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Green</Text> and low metrics in <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Red</Text>.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/admin-dashboard' as any)}>
          <Icon name="grid" size={22} color="#475569" />
          <Text style={styles.tabText}>Dashboard</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/expenses' as any)}>
          <Icon name="card" size={22} color="#475569" />
          <Text style={styles.tabText}>Expenses</Text>
        </Pressable>
        <Pressable style={styles.tabItemActive}>
          <Icon name="chart" size={22} color="#064E3B" />
          <Text style={styles.tabTextActive}>Reports</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/settings' as any)}>
          <Icon name="gear" size={22} color="#475569" />
          <Text style={styles.tabText}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#064E3B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#042F2E',
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12 },
  tabItemActive: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12, backgroundColor: '#ECFDF5' },
  tabText: { fontSize: 12, fontWeight: '500', color: '#94A3B8' },
  tabTextActive: { fontSize: 12, fontWeight: '700', color: '#064E3B' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { padding: 4, position: 'relative' },
  notificationDot: { position: 'absolute', top: 4, right: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 },
  profileName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', display: Platform.OS === 'web' ? 'flex' : 'none' },
  profileAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },

  scrollContent: { padding: 20, paddingBottom: 100 },
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#64748B' },

  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  loadingText: { fontSize: 14, fontWeight: '500', color: '#64748B' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginBottom: 20 },
  reportCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  reportTitle: { fontSize: 12, fontWeight: '500', color: '#64748B', marginBottom: 4 },
  reportValue: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { fontSize: 11, fontWeight: '600' },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  chartTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  chartSubtitle: { fontSize: 12, fontWeight: '500', color: '#64748B', marginTop: 2 },
  chartTabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 3, gap: 4 },
  chartTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7 },
  chartTabActive: { backgroundColor: '#064E3B', elevation: 2, shadowColor: '#064E3B', shadowOpacity: 0.2, shadowRadius: 2 },
  chartTabText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  chartTabTextActive: { color: '#FFFFFF', fontWeight: '700' },

  metricSwitchContainer: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metricPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricPillActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  metricPillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  metricPillTextActive: { color: '#064E3B', fontWeight: '700' },

  legendContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontWeight: '500', color: '#64748B' },

  tooltipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tooltipBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tooltipBadgeText: { fontSize: 11, fontWeight: '700' },
  tooltipLabel: { fontSize: 12, fontWeight: '500', color: '#334155' },
  tooltipValue: { fontWeight: '800', color: '#0F172A' },

  svgWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  touchOverlay: { ...StyleSheet.absoluteFill },
  touchArea: { position: 'absolute', width: 36, height: 36, borderRadius: 18 },

  chartFootnote: { fontSize: 11, fontWeight: '500', color: '#94A3B8', marginTop: 14, textAlign: 'center' },
});
