import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function StaffProfileScreen() {
  const router = useRouter();
  const { user, logout, toggleDuty, updateService } = useAuth();

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      getDoc(doc(db, 'users', user.id)).then(docSnap => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });

      AsyncStorage.getItem(`@profile_pic_${user.id}`).then(pic => {
        if (pic) setProfilePic(pic);
      });
    }
  }, [user?.id]);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && user?.id) {
      setProfilePic(result.assets[0].uri);
      await AsyncStorage.setItem(`@profile_pic_${user.id}`, result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    // Direct logout without confirmation as requested
    await logout();
    router.replace('/(auth)/role-choice' as never);
  };

  const services = ['BREAKFAST SERVICE', 'LUNCH SERVICE', 'DINNER SERVICE', 'NIGHT SHIFT'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Staff Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Top Profile Section */}
        <View style={styles.topProfileSection}>
          <Pressable style={styles.avatarWrapper} onPress={handlePickImage}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.largeAvatar} />
            ) : (
              <View style={[styles.largeAvatar, { backgroundColor: '#022C22', justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="person" size={40} color="#34D399" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={14} color="#064E3B" />
            </View>
          </Pressable>

          <Text style={styles.userName}>{userData?.name || user?.name || 'Manager Name'}</Text>
          <Text style={styles.userRole}>{(user?.role || 'Manager').toUpperCase()}</Text>

          {/* Contact Details */}
          <View style={styles.contactDetailsRow}>
            <View style={styles.contactItem}>
              <Icon name="mail" size={14} color="#A7F3D0" />
              <Text style={styles.contactText}>{userData?.email || user?.email || 'email@example.com'}</Text>
            </View>
            {userData?.phone && (
              <View style={styles.contactItem}>
                <Icon name="phone" size={14} color="#A7F3D0" />
                <Text style={styles.contactText}>{userData.phone}</Text>
              </View>
            )}
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() => router.push('/edit-profile' as never)}>
            <Icon name="edit" size={16} color="#064E3B" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Duty Status Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shift & Duty Status</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="clock" size={20} color="#059669" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Active On Duty</Text>
                <Text style={styles.settingSubtext}>
                  {user?.isOnDuty ? 'Currently receiving shift alerts' : 'Currently off duty'}
                </Text>
              </View>
            </View>
            <Switch
              value={user?.isOnDuty ?? true}
              onValueChange={toggleDuty}
              trackColor={{ false: '#CBD5E1', true: '#34D399' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <Text style={[styles.settingLabel, { marginTop: 12, marginBottom: 8 }]}>Current Service Shift</Text>
          <View style={styles.serviceChips}>
            {services.map((svc) => {
              const selected = user?.service === svc;
              return (
                <Pressable
                  key={svc}
                  onPress={() => updateService(svc)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {svc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </Pressable>
        </View>

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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topProfileSection: {
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#34D399',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34D399',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#064E3B',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#34D399',
    marginBottom: 16,
  },
  contactDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#A7F3D0',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34D399',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editButtonText: {
    color: '#064E3B',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#475569',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  settingSubtext: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  serviceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#022C22',
    borderColor: '#022C22',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#34D399',
  },
  logoutContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
