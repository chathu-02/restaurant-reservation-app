import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // For editing password
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [staffName, setStaffName] = useState('');

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

  const openResetModal = (staffId: string, name: string) => {
    setSelectedStaffId(staffId);
    setStaffName(name);
    setNewPassword('');
    setIsEditModalVisible(true);
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }
    try {
      // 1. Update user password
      const staffRef = doc(db, 'users', selectedStaffId);
      await updateDoc(staffRef, { password: newPassword });
      
      // 2. Add notification for staff
      await addDoc(collection(db, 'notifications'), {
        type: 'PASSWORD_CHANGED',
        staffId: selectedStaffId,
        message: 'Your password has been changed by the manager.',
        isRead: false,
        createdAt: serverTimestamp()
      });
      
      // 3. Mark the reset notification as read
      const q = query(collection(db, 'notifications'), where('type', '==', 'PASSWORD_RESET'), where('staffId', '==', selectedStaffId), where('status', '==', 'UNREAD'));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (notifDoc) => {
        await updateDoc(doc(db, 'notifications', notifDoc.id), { status: 'READ' });
      });

      setIsEditModalVisible(false);
      Alert.alert('Success', 'Password has been reset successfully.');
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Failed to reset password.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
      
      {/* Header */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.navTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="bell" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No new notifications.</Text>
          </View>
        ) : (
          notifications.map(notif => (
            <View key={notif.id} style={styles.notificationCard}>
              <View style={styles.notifHeader}>
                <View style={styles.iconCircle}>
                  <Icon name="lock" size={20} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>Password Reset Request</Text>
                  <Text style={styles.notifDesc}>{notif.staffName || 'A staff member'} requested a new password.</Text>
                </View>
              </View>
              <Pressable style={styles.actionBtn} onPress={() => openResetModal(notif.staffId, notif.staffName)}>
                <Text style={styles.actionBtnText}>Reset Password</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {/* Reset Password Modal */}
      <Modal visible={isEditModalVisible} animationType="fade" transparent={true} onRequestClose={() => setIsEditModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password for {staffName}</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>New Password</Text>
              <TextInput
                style={styles.formInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleResetPassword}>
                <Text style={styles.saveButtonText}>Reset & Notify</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#064E3B', paddingHorizontal: 16, paddingVertical: 16,
  },
  navTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  content: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_500Medium', color: '#94A3B8' },
  
  notificationCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16,
    elevation: 8, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 16,
    borderLeftWidth: 4, borderLeftColor: '#F59E0B', // Rich orange accent for the edge
  },
  notifHeader: { flexDirection: 'row', gap: 12, marginBottom: 20, alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  notifTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 2 },
  notifDesc: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748B' },
  
  actionBtn: { 
    backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 8, alignItems: 'center',
    elevation: 4, shadowColor: '#10B981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_700Bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, elevation: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 24 },
  
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#475569', marginBottom: 8 },
  formInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, fontFamily: 'Inter_500Medium', color: '#0F172A' },
  
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#64748B' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#10B981', alignItems: 'center' },
  saveButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
