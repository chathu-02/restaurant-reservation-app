import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { Logo } from '@/components/logo';

export default function ReportsScreen() {
  const router = useRouter();
  const [chartView, setChartView] = useState('weekly');

  // Mock Report Data
  const reports = [
    { title: 'Weekly Revenue', value: '$12,450', trend: '+15%', trendType: 'up', icon: 'chart', color: '#10B981', bgColor: '#ECFDF5' },
    { title: 'Customer Footfall', value: '1,240', trend: '+5%', trendType: 'up', icon: 'users', color: '#3B82F6', bgColor: '#EFF6FF' },
    { title: 'Average Order Value', value: '$45.20', trend: '-2%', trendType: 'down', icon: 'basket', color: '#F59E0B', bgColor: '#FFFBEB' },
    { title: 'Table Turnover', value: '45 mins', trend: 'Stable', trendType: 'neutral', icon: 'clock', color: '#8B5CF6', bgColor: '#F5F3FF' },
  ];

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
            <Text style={styles.profileName}>Admin</Text>
            <View style={styles.profileAvatarPlaceholder}>
              <Icon name="person" size={16} color="#064E3B" />
            </View>
            <Icon name="chevron-down" size={16} color="#A7F3D0" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Performance Reports</Text>
          <Text style={styles.pageSubtitle}>Analyze restaurant metrics and sales.</Text>
        </View>

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
        
        {/* Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue Overview</Text>
            <View style={styles.chartTabs}>
              <Pressable style={[styles.chartTab, chartView === 'weekly' && styles.chartTabActive]} onPress={() => setChartView('weekly')}>
                <Text style={[styles.chartTabText, chartView === 'weekly' && styles.chartTabTextActive]}>Weekly</Text>
              </Pressable>
              <Pressable style={[styles.chartTab, chartView === 'monthly' && styles.chartTabActive]} onPress={() => setChartView('monthly')}>
                <Text style={[styles.chartTabText, chartView === 'monthly' && styles.chartTabTextActive]}>Monthly</Text>
              </Pressable>
              <Pressable style={[styles.chartTab, chartView === 'annually' && styles.chartTabActive]} onPress={() => setChartView('annually')}>
                <Text style={[styles.chartTabText, chartView === 'annually' && styles.chartTabTextActive]}>Annually</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.chartArea}>
            {/* Simple Mock Bar Chart */}
            <View style={styles.chartBars}>
              {(chartView === 'weekly' ? [30, 50, 40, 70, 90, 60, 80] : chartView === 'monthly' ? [40, 60, 50, 80, 100, 70, 90, 85, 95, 110, 105, 120] : [70, 90, 120, 150, 180]).map((h, i) => (
                <View key={i} style={styles.chartBarCol}>
                  <View style={[styles.chartBarFill, { height: h }]} />
                </View>
              ))}
            </View>
            <View style={styles.chartLabels}>
              {(chartView === 'weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : chartView === 'monthly' ? ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] : ['20', '21', '22', '23', '24']).map((l, i) => (
                <Text key={i} style={styles.chartLabelText}>{l}</Text>
              ))}
            </View>
          </View>
        </View>

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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#064E3B', paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#042F2E',
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navTitle: { fontSize: 20, fontFamily: 'Inter_800ExtraBold', color: '#FFFFFF' },
  bottomTabBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0',
    position: 'absolute', bottom: 0, width: '100%',
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12 },
  tabItemActive: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12, backgroundColor: '#ECFDF5' },
  tabText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#94A3B8' },
  tabTextActive: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#064E3B' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { padding: 4, position: 'relative' },
  notificationDot: { position: 'absolute', top: 4, right: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 },
  profileName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF', display: Platform.OS === 'web' ? 'flex' : 'none' },
  profileAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerSection: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontFamily: 'Inter_800ExtraBold', color: '#0F172A', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#64748B' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  reportCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    elevation: 6, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12,
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  reportTitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748B', marginBottom: 4 },
  reportValue: { fontSize: 22, fontFamily: 'Inter_800ExtraBold', color: '#0F172A', marginBottom: 8 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  
  chartCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    elevation: 8, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 16,
  },
  chartTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#0F172A' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  chartTabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4 },
  chartTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  chartTabActive: { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  chartTabText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#64748B' },
  chartTabTextActive: { color: '#0F172A' },
  
  chartArea: { height: 180, justifyContent: 'flex-end' },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, paddingHorizontal: 8 },
  chartBarCol: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  chartBarFill: { width: '100%', maxWidth: 20, backgroundColor: '#10B981', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 8 },
  chartLabelText: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: 'Inter_500Medium', color: '#94A3B8' },
});
