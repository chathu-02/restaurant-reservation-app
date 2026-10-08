import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../components/ui/Icon';

const staffAvatarImg = require('../../assets/images/staff_avatar.jpg');

export default function StaffProfileScreen() {
  const router = useRouter();

  const [isOnShift, setIsOnShift] = useState(true);
  const [alertsSound, setAlertsSound] = useState(true);

  // User Profile Data
  const [profile, setProfile] = useState({
    name: 'Kaweerna Sneha',
    role: 'Floor Operations Manager',
    staffId: '#ST-8821',
    email: 'kaweerna.sneha@email.com',
    phone: '+1 (555) 382-9011',
    station: 'Zone A',
    rating: '4.9 ★',
    shiftsCount: '142',
  });

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isTableMapModalOpen, setIsTableMapModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);

  // PIN security state
  const [pinCurrent, setPinCurrent] = useState('');
  const [pinNew, setPinNew] = useState('');

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    }));
    setIsEditModalOpen(false);
    Alert.alert('Updated', 'Personal details updated successfully');
  };

  const handleUpdatePin = () => {
    if (pinNew.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }
    setIsSecurityModalOpen(false);
    setPinCurrent('');
    setPinNew('');
    Alert.alert('Security', 'Manager terminal PIN updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out of Session',
      'Are you sure you want to log out of terminal session #04?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            router.push('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header: Back button, Title + Staff ID, Edit button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.push('/dashboard')}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={20} color="#374151" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Profile & Settings</Text>
            <Text style={styles.headerSubtitle}>Staff ID {profile.staffId}</Text>
          </View>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => {
              setEditName(profile.name);
              setEditEmail(profile.email);
              setEditPhone(profile.phone);
              setIsEditModalOpen(true);
            }}
            activeOpacity={0.7}
          >
            <Icon name="edit" size={17} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Hero Card: Avatar, Name, Role, On-Shift Pill, 3 Stats */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.avatarWrap}>
              <Image source={staffAvatarImg} style={styles.heroAvatar} />
              <TouchableOpacity
                style={styles.cameraPill}
                onPress={() => Alert.alert('Avatar Photo', 'Select a new staff portrait photo from device.')}
                activeOpacity={0.7}
              >
                <Icon name="camera" size={11} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.heroDetails}>
              <Text style={styles.heroName}>{profile.name}</Text>
              <Text style={styles.heroRole}>{profile.role}</Text>

              {/* On Shift Toggle Pill */}
              <TouchableOpacity
                style={[
                  styles.shiftTogglePill,
                  isOnShift ? styles.shiftPillActive : styles.shiftPillInactive,
                ]}
                onPress={() => setIsOnShift(!isOnShift)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.shiftStatusDot,
                    { backgroundColor: isOnShift ? '#00B37E' : '#9CA3AF' },
                  ]}
                />
                <Text
                  style={[
                    styles.shiftStatusText,
                    { color: isOnShift ? '#00875A' : '#6B7280' },
                  ]}
                >
                  {isOnShift ? 'On Shift • Duty' : 'Off Duty'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3 Stats horizontal strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.shiftsCount}</Text>
              <Text style={styles.statLabel}>Shifts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.station}</Text>
              <Text style={styles.statLabel}>Station</Text>
            </View>
          </View>
        </View>

        {/* SECTION 1: ACCOUNT & SECURITY */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>ACCOUNT & SECURITY</Text>

          <View style={styles.settingsGroupCard}>
            {/* 1. Personal Details */}
            <TouchableOpacity
              style={styles.settingItemRow}
              onPress={() => {
                setEditName(profile.name);
                setEditEmail(profile.email);
                setEditPhone(profile.phone);
                setIsEditModalOpen(true);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: '#EEF2FF' }]}>
                <Icon name="person" size={18} color="#6366F1" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Personal Details</Text>
                <Text style={styles.settingSubtitle}>Name, mobile & contact info</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            {/* 2. Security & Passcode */}
            <TouchableOpacity
              style={styles.settingItemRow}
              onPress={() => setIsSecurityModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: '#FFF7ED' }]}>
                <Icon name="lock" size={18} color="#EA580C" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Security & Passcode</Text>
                <Text style={styles.settingSubtitle}>Change PIN, password & biometric</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            {/* 3. Shift Alerts & Sound */}
            <View style={styles.settingItemRow}>
              <View style={[styles.settingIconWrap, { backgroundColor: '#E8FAF0' }]}>
                <Icon name="bell" size={18} color="#009669" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Shift Alerts & Sound</Text>
                <Text style={styles.settingSubtitle}>Order pings & kitchen bell</Text>
              </View>
              <Switch
                trackColor={{ false: '#E5E7EB', true: '#00B37E' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
                onValueChange={setAlertsSound}
                value={alertsSound}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: PREFERENCES & SUPPORT */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>PREFERENCES & SUPPORT</Text>

          <View style={styles.settingsGroupCard}>
            {/* 1. Table & Floor Map */}
            <TouchableOpacity
              style={styles.settingItemRow}
              onPress={() => setIsTableMapModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: '#E8FAF0' }]}>
                <Icon name="grid" size={18} color="#009669" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Table & Floor Map</Text>
                <Text style={styles.settingSubtitle}>Default layout & table assignment</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            {/* 2. Help & Manager Desk */}
            <TouchableOpacity
              style={styles.settingItemRow}
              onPress={() => setIsHelpModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Icon name="help" size={18} color="#3B82F6" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Help & Manager Desk</Text>
                <Text style={styles.settingSubtitle}>Emergency override & guides</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Red Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={18} color="#DC2626" />
          <Text style={styles.logoutButtonText}>Log Out of Session</Text>
        </TouchableOpacity>

        {/* Footer Info */}
        <Text style={styles.footerInfoText}>
          Stitch POS v2.4.1 • Terminal #04 • Synced
        </Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={styles.fieldLabel}>Work Email</Text>
              <TextInput
                style={styles.modalInput}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Contact Mobile</Text>
              <TextInput
                style={styles.modalInput}
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Security PIN Modal */}
      <Modal
        visible={isSecurityModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSecurityModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security & Passcode</Text>
              <TouchableOpacity onPress={() => setIsSecurityModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Current Terminal PIN</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="4-digit PIN"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                value={pinCurrent}
                onChangeText={setPinCurrent}
              />

              <Text style={styles.fieldLabel}>New Manager PIN</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="New 4-digit PIN"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                value={pinNew}
                onChangeText={setPinNew}
              />

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleUpdatePin}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveBtnText}>Update PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Table & Floor Map Modal */}
      <Modal
        visible={isTableMapModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTableMapModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Zone A Table Map</Text>
              <TouchableOpacity onPress={() => setIsTableMapModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubText}>
              20 Total Tables • 12 Active • 8 Available
            </Text>

            <View style={styles.tableGridPreview}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <View key={num} style={styles.tableBlockOccupied}>
                  <Text style={styles.tableBlockText}>T{num}</Text>
                </View>
              ))}
              {[13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                <View key={num} style={styles.tableBlockFree}>
                  <Text style={styles.tableBlockFreeText}>T{num}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => setIsTableMapModalOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSaveBtnText}>Close Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal
        visible={isHelpModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHelpModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manager Desk & Hotline</Text>
              <TouchableOpacity onPress={() => setIsHelpModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.helpHotlineBox}>
              <Text style={styles.helpBoxTitle}>Emergency Support Hotline</Text>
              <Text style={styles.helpBoxPhone}>+1 (800) 555-STITCH (Ext 401)</Text>
              <Text style={styles.helpBoxSub}>Available 24/7 for shift overrides</Text>
            </View>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => setIsHelpModalOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSaveBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 1,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#EEF2F0',
  },
  cameraPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#181A1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroDetails: {
    flex: 1,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  heroRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 6,
  },
  shiftTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  shiftPillActive: {
    backgroundColor: '#E8FAF0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  shiftPillInactive: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shiftStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  shiftStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  sectionContainer: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  settingsGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  footerInfoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  modalForm: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  modalSaveBtn: {
    backgroundColor: '#181A1E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tableGridPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tableBlockOccupied: {
    width: '22%',
    paddingVertical: 10,
    backgroundColor: '#EA580C',
    borderRadius: 8,
    alignItems: 'center',
  },
  tableBlockText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tableBlockFree: {
    width: '22%',
    paddingVertical: 10,
    backgroundColor: '#E8FAF0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    alignItems: 'center',
  },
  tableBlockFreeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00875A',
  },
  helpHotlineBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  helpBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  helpBoxPhone: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
    marginVertical: 4,
  },
  helpBoxSub: {
    fontSize: 11,
    color: '#059669',
  },
});
