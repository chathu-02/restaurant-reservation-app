import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Logo } from '@/components/logo';

export default function AdminDashboardScreen() {
  const router = useRouter();

  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const staffData: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Exclude customers from the staff dashboard
          if (data.role && data.role.toLowerCase() !== 'customer') {
            staffData.push({ id: doc.id, ...data });
          }
        });
        setStaffList(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchStaff();
  }, []);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({ name: '', email: '', phone: '', address: '', password: '', role: 'Front Office' });
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '', role: '', password: '' });
  const [filterType, setFilterType] = useState<'All' | 'OnDuty' | 'OffDuty' | 'Managers'>('All');
  
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('type', '==', 'PASSWORD_RESET'), where('status', '==', 'UNREAD'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach(docSnap => {
        notifs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, []);

  const totalStaff = staffList.length;
  const onDutyCount = staffList.filter(s => s.isOnDuty).length;
  const managerCount = staffList.filter(s => s.role?.toLowerCase().includes('manager')).length;
  const offDutyCount = totalStaff - onDutyCount;

  const stats = [
    { 
      id: 'All' as const,
      label: 'Total Staff', 
      value: totalStaff, 
      icon: 'users' as const, 
      accentColor: '#10B981', 
      lightBg: '#ECFDF5', 
      percent: 100 
    },
    { 
      id: 'OnDuty' as const,
      label: 'On Duty Today', 
      value: onDutyCount, 
      icon: 'clock' as const, 
      accentColor: '#0284C7', 
      lightBg: '#E0F2FE', 
      percent: totalStaff ? (onDutyCount / totalStaff) * 100 : 0 
    },
    { 
      id: 'OffDuty' as const,
      label: 'Off Duty', 
      value: offDutyCount, 
      icon: 'walk' as const, 
      accentColor: '#F59E0B', 
      lightBg: '#FEF3C7', 
      percent: totalStaff ? (offDutyCount / totalStaff) * 100 : 0 
    },
    { 
      id: 'Managers' as const,
      label: 'Managers', 
      value: managerCount, 
      icon: 'star' as const, 
      accentColor: '#8B5CF6', 
      lightBg: '#F5F3FF', 
      percent: totalStaff ? (managerCount / totalStaff) * 100 : 0 
    },
  ];

  const handleAddStaff = async () => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...newStaffForm,
        isOnDuty: false,
        createdAt: serverTimestamp()
      });
      setStaffList(prev => [...prev, { id: docRef.id, ...newStaffForm, isOnDuty: false }]);
      setIsAddModalVisible(false);
      setNewStaffForm({ name: '', email: '', phone: '', address: '', password: '', role: 'Front Office' });
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const openEditModal = (staff: any) => {
    setSelectedStaff(staff);
    setEditForm({
      name: staff.name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      address: staff.address || '',
      role: staff.role || '',
      password: staff.password || ''
    });
    setIsEditModalVisible(true);
  };

  // ... Update actions remain same (handleUpdateStaff, handleDeleteStaff)

  const handleUpdateStaff = async () => {
    if (!selectedStaff?.id) return;
    try {
      const staffRef = doc(db, 'users', selectedStaff.id);
      await updateDoc(staffRef, { ...editForm });
      setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? { ...s, ...editForm } : s));
      
      // Notify staff if password changed and mark their reset notifications as read
      if (editForm.password !== selectedStaff.password) {
         await addDoc(collection(db, 'notifications'), {
           type: 'PASSWORD_CHANGED',
           staffId: selectedStaff.id,
           message: 'Your password has been changed by the manager.',
           isRead: false,
           createdAt: serverTimestamp()
         });
         
         const q = query(collection(db, 'notifications'), where('type', '==', 'PASSWORD_RESET'), where('staffId', '==', selectedStaff.id), where('status', '==', 'UNREAD'));
         const snapshot = await getDocs(q);
         snapshot.forEach(async (notifDoc) => {
           await updateDoc(doc(db, 'notifications', notifDoc.id), { status: 'READ' });
         });
      }

      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff?.id) return;
    try {
      await deleteDoc(doc(db, 'users', selectedStaff.id));
      setStaffList(prev => prev.filter(s => s.id !== selectedStaff.id));
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const handleDeleteStaffDirectly = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setStaffList(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting staff directly:', error);
    }
  };

  const displayedStaff = staffList.filter(staff => {
    if (filterType === 'OnDuty') return staff.isOnDuty;
    if (filterType === 'OffDuty') return !staff.isOnDuty;
    if (filterType === 'Managers') return staff.role?.toLowerCase().includes('manager');
    return true;
  });

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
            {notifications.length > 0 && <View style={styles.notificationDot} />}
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
        
        {/* Stats Grid - High-Impact Attractive Cards */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const isSelected = filterType === stat.id;
            return (
              <Pressable 
                key={index} 
                onPress={() => setFilterType(stat.id)}
                style={[
                  styles.statCard, 
                  isSelected ? styles.statCardActive : styles.statCardInactive
                ]}
              >
                {/* Vibrant top accent line for white cards */}
                {!isSelected && (
                  <View style={[styles.statAccentLine, { backgroundColor: stat.accentColor }]} />
                )}

                <View style={styles.statCardTop}>
                  <View style={styles.statTextGroup}>
                    <Text style={[styles.statValue, { color: isSelected ? '#FFFFFF' : '#0F172A' }]}>
                      {stat.value}
                    </Text>
                    <Text 
                      style={[styles.statLabel, { color: isSelected ? '#A7F3D0' : '#64748B' }]}
                      numberOfLines={1}
                    >
                      {stat.label}
                    </Text>
                  </View>
                  <View style={[
                    styles.statIconContainer, 
                    { backgroundColor: isSelected ? 'rgba(255,255,255,0.18)' : stat.lightBg }
                  ]}>
                    <Icon 
                      name={stat.icon} 
                      size={20} 
                      color={isSelected ? '#FFFFFF' : stat.accentColor} 
                    />
                  </View>
                </View>

                {/* Progress Indicators */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressText, { color: isSelected ? 'rgba(255,255,255,0.7)' : '#94A3B8' }]}>
                      0%
                    </Text>
                    <Text style={[
                      styles.progressText, 
                      styles.progressTextBold, 
                      { color: isSelected ? '#34D399' : stat.accentColor }
                    ]}>
                      {Math.round(stat.percent)}%
                    </Text>
                  </View>
                  <View style={[styles.progressBarBg, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#F1F5F9' }]}>
                    <View style={[
                      styles.progressBarFill, 
                      { 
                        width: `${Math.max(6, Math.min(100, stat.percent))}%`, 
                        backgroundColor: isSelected ? '#34D399' : stat.accentColor 
                      }
                    ]} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Table Section */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderSection}>
            <Text style={styles.tableTitle}>Active Team Members</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <View style={styles.tableFilters}>
                {(['All', 'OnDuty', 'OffDuty', 'Managers'] as const).map((type) => {
                  const active = filterType === type;
                  const label = type === 'All' ? 'All' : type === 'OnDuty' ? 'On Duty' : type === 'OffDuty' ? 'Off Duty' : 'Managers';
                  return (
                    <Pressable 
                      key={type}
                      style={[styles.filterPill, active && styles.filterPillActive]}
                      onPress={() => setFilterType(type)}
                    >
                      <Text style={active ? styles.filterTextActive : styles.filterText}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable style={styles.addStaffButton} onPress={() => setIsAddModalVisible(true)}>
                <Icon name="plus" size={16} color="#FFFFFF" />
                <Text style={styles.addStaffButtonText}>Add Staff</Text>
              </Pressable>
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View style={styles.tableRowHeader}>
                <Text style={[styles.tableCol, { width: 40 }]}>No</Text>
                <Text style={[styles.tableCol, { width: 150 }]}>Name</Text>
                <Text style={[styles.tableCol, { width: 180 }]}>Email</Text>
                <Text style={[styles.tableCol, { width: 100 }]}>Role</Text>
                <Text style={[styles.tableCol, { width: 100 }]}>Status</Text>
                <Text style={[styles.tableCol, { width: 60, textAlign: 'center' }]}>Action</Text>
              </View>

              {/* Table Rows */}
              {displayedStaff.map((staff, index) => (
                <View key={staff.id} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                  <Text style={[styles.tableCell, { width: 40, color: '#000000' }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.tableCellBold, { width: 150 }]}>{staff.name || 'Unknown'}</Text>
                  <Text style={[styles.tableCell, { width: 180 }]}>{staff.email || 'No email'}</Text>
                  <View style={{ width: 100, justifyContent: 'center' }}>
                    <Text style={styles.tableRoleText}>{staff.role || 'Staff'}</Text>
                  </View>
                  <View style={{ width: 100, justifyContent: 'center' }}>
                    <View style={staff.isOnDuty ? styles.statusPillActive : styles.statusPillInactive}>
                      <View style={staff.isOnDuty ? styles.statusDotActive : styles.statusDotInactive} />
                      <Text style={staff.isOnDuty ? styles.statusTextActive : styles.statusTextInactive}>
                        {staff.isOnDuty ? 'On Duty' : 'Off Duty'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <Pressable onPress={() => openEditModal(staff)}>
                      <Icon name="edit" size={20} color="#3B82F6" />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteStaffDirectly(staff.id)}>
                      <Icon name="trash" size={20} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

      </ScrollView>

      {/* Add Staff Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Staff Member</Text>
              <Pressable onPress={() => setIsAddModalVisible(false)} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. John Doe"
                  value={newStaffForm.name}
                  onChangeText={(text) => setNewStaffForm({ ...newStaffForm, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. john@oceangrace.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={newStaffForm.email}
                  onChangeText={(text) => setNewStaffForm({ ...newStaffForm, email: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. +1 234 567 8900"
                  keyboardType="phone-pad"
                  value={newStaffForm.phone}
                  onChangeText={(text) => setNewStaffForm({ ...newStaffForm, phone: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Assign Password</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter temporary password"
                  secureTextEntry={true}
                  value={newStaffForm.password}
                  onChangeText={(text) => setNewStaffForm({ ...newStaffForm, password: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Role</Text>
                <View style={styles.roleSelectContainer}>
                  {['Chef', 'Front Office', 'Manager'].map((role) => (
                    <Pressable 
                      key={role} 
                      style={[styles.roleOption, newStaffForm.role === role && styles.roleOptionActive]}
                      onPress={() => setNewStaffForm({ ...newStaffForm, role })}
                    >
                      <Text style={[styles.roleOptionText, newStaffForm.role === role && styles.roleOptionTextActive]}>
                        {role}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Home Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Full address here..."
                  multiline={true}
                  numberOfLines={3}
                  value={newStaffForm.address}
                  onChangeText={(text) => setNewStaffForm({ ...newStaffForm, address: text })}
                />
              </View>

              <Pressable style={styles.submitButton} onPress={handleAddStaff}>
                <Text style={styles.submitButtonText}>Add Staff Member</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit/Delete Staff Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Staff Details</Text>
              <Pressable onPress={() => setIsEditModalVisible(false)} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Role</Text>
                <TextInput
                  style={styles.formInput}
                  value={editForm.role}
                  onChangeText={(text) => setEditForm({ ...editForm, role: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="phone-pad"
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Change Password</Text>
                <TextInput
                  style={styles.formInput}
                  value={editForm.password}
                  onChangeText={(text) => setEditForm({ ...editForm, password: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Home Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  multiline={true}
                  numberOfLines={3}
                  value={editForm.address}
                  onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                />
              </View>

              <View style={styles.actionButtonsRow}>
                <Pressable style={styles.deleteButton} onPress={handleDeleteStaff}>
                  <Icon name="trash" size={20} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
                <Pressable style={styles.updateButton} onPress={handleUpdateStaff}>
                  <Text style={styles.submitButtonText}>Update</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItemActive}>
          <Icon name="grid" size={22} color="#064E3B" />
          <Text style={styles.tabTextActive}>Dashboard</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/expenses' as any)}>
          <Icon name="card" size={22} color="#475569" />
          <Text style={styles.tabText}>Expenses</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/reports' as any)}>
          <Icon name="chart" size={22} color="#475569" />
          <Text style={styles.tabText}>Reports</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // Very subtle emerald background
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#064E3B', // Emerald Green Background
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#042F2E',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF', // White text
  },
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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  tabItemActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    backgroundColor: '#ECFDF5',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  tabTextActive: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#064E3B',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  profileName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  profileAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    rowGap: 14,
  },
  statCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statCardActive: {
    backgroundColor: '#064E3B',
    borderWidth: 1.5,
    borderColor: '#10B981', // Brighter emerald border to pop out
    elevation: 12,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  statCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)', // Soft emerald border
    elevation: 8, // Higher elevation for highlight
    shadowColor: '#047857', // Deeper green shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  statAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statTextGroup: {
    flex: 1,
    marginRight: 8,
  },
  statValue: {
    fontSize: 26,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  statIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  progressTextBold: {
    fontFamily: 'Inter_700Bold',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  tableHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  tableFilters: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
    elevation: 2,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  filterTextActive: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  addStaffButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addStaffButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  tableRowHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tableCol: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#A7F3D0',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#94A3B8', // Darker line color
    borderRadius: 8,
    marginBottom: 4,
  },
  tableRowEven: {
    backgroundColor: '#ffffff44',
  },
  tableRowOdd: {
    backgroundColor: '#f8fafc4e',
  },
  tableCell: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#000000',
  },
  tableCellBold: {
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  tableAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tableRoleText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#000000',
  },
  statusPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  statusDotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  statusTextActive: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#15803D',
  },
  statusTextInactive: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  /* Modal Styles Below */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  closeModalButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
  },
  roleSelectContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleOptionActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  roleOptionText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  roleOptionTextActive: {
    color: '#064E3B',
    fontFamily: 'Inter_600SemiBold',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#064E3B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
    gap: 12,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#064E3B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 6,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});
