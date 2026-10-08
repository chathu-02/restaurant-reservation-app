import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';

export default function AdminDashboardScreen() {
  const router = useRouter();

  // Mock data for frontend UI
  const [staffList] = useState([
    { id: '1', name: 'Sarah Mitchell', role: 'Manager', email: 'sarah.m@oceangrace.com', isOnDuty: true, avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256' },
    { id: '2', name: 'Michael Chang', role: 'Head Chef', email: 'michael.c@oceangrace.com', isOnDuty: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256' },
    { id: '3', name: 'Emily Davis', role: 'Host', email: 'emily.d@oceangrace.com', isOnDuty: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256' },
    { id: '4', name: 'James Wilson', role: 'Waiter', email: 'james.w@oceangrace.com', isOnDuty: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256' },
    { id: '5', name: 'Linda Martinez', role: 'Waitress', email: 'linda.m@oceangrace.com', isOnDuty: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256' },
  ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      
      {/* Dark Emerald Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Staff Management</Text>
        <Pressable style={styles.addButton}>
          <Icon name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="users" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Total Staff</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Icon name="check" size={20} color="#059669" />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>On Duty</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="star" size={20} color="#D97706" />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Managers</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Team Members</Text>
          <Pressable>
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
        </View>

        {/* Staff List */}
        {staffList.map((staff) => (
          <Pressable key={staff.id} style={styles.staffCard}>
            <Image source={{ uri: staff.avatar }} style={styles.avatar} />
            
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>{staff.name}</Text>
              <Text style={styles.staffEmail}>{staff.email}</Text>
              
              <View style={styles.badgeRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{staff.role}</Text>
                </View>
                {staff.isOnDuty ? (
                  <View style={styles.dutyBadgeActive}>
                    <View style={styles.dotActive} />
                    <Text style={styles.dutyTextActive}>On Duty</Text>
                  </View>
                ) : (
                  <View style={styles.dutyBadgeInactive}>
                    <View style={styles.dotInactive} />
                    <Text style={styles.dutyTextInactive}>Off Duty</Text>
                  </View>
                )}
              </View>
            </View>

            <Pressable style={styles.moreButton}>
              <Icon name="chevron-right" size={20} color="#94A3B8" />
            </Pressable>
          </Pressable>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#022C22',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
  },
  staffCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: '#F1F5F9',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  staffEmail: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  dutyBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  dotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  dutyTextActive: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
  },
  dutyBadgeInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  dutyTextInactive: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  moreButton: {
    padding: 8,
  },
});
