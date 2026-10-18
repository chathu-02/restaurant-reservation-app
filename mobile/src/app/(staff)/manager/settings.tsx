import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Platform, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@/components/ui/Icon';
import { Logo } from '@/components/logo';
import { logout } from '@/lib/auth';

export default function SettingsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [restaurantName, setRestaurantName] = useState('OceanGrace Seafood');

  useEffect(() => {
    AsyncStorage.getItem('restaurantName').then(name => {
      if (name) setRestaurantName(name);
    });
    AsyncStorage.getItem('notifications').then(notifs => {
      if (notifs !== null) setNotifications(notifs === 'true');
    });
  }, []);

  const handleSaveRestaurantName = (text: string) => {
    setRestaurantName(text);
    AsyncStorage.setItem('restaurantName', text);
  };

  const handleToggleNotifs = (val: boolean) => {
    setNotifications(val);
    AsyncStorage.setItem('notifications', val.toString());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
      
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Logo size={28} badge />
          <Text style={styles.navTitle}>{restaurantName}</Text>
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
          <Text style={styles.pageTitle}>System Settings</Text>
          <Text style={styles.pageSubtitle}>Configure your restaurant management system.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>General Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Restaurant Name</Text>
              <Text style={styles.settingDesc}>Appears on receipts and user app.</Text>
            </View>
            <TextInput 
              style={styles.textInput} 
              value={restaurantName}
              onChangeText={handleSaveRestaurantName}
              placeholderTextColor="#94A3B8"
            />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive alerts for new reservations.</Text>
            </View>
            <Switch 
              value={notifications}
              onValueChange={handleToggleNotifs}
              trackColor={{ false: '#CBD5E1', true: '#34D399' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Actions</Text>
          <Pressable 
            style={styles.logoutButton} 
            onPress={async () => {
              try {
                await logout();
              } catch (e) {
                console.warn('Logout error:', e);
              }
              router.replace('/(staff)/manager' as any);
            }}
          >
            <Icon name="logout" size={16} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
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
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/reports' as any)}>
          <Icon name="chart" size={22} color="#475569" />
          <Text style={styles.tabText}>Reports</Text>
        </Pressable>
        <Pressable style={styles.tabItemActive}>
          <Icon name="gear" size={22} color="#064E3B" />
          <Text style={styles.tabTextActive}>Settings</Text>
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
  navTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  bottomTabBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0',
    position: 'absolute', bottom: 0, width: '100%',
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
  headerSection: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#64748B' },
  
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24,
    elevation: 6, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingInfo: { flex: 1, paddingRight: 16 },
  settingName: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  settingDesc: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  
  textInput: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 14, fontWeight: '500', color: '#0F172A', width: 200,
  },
  
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEF2F2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, gap: 6, marginTop: 12,
    alignSelf: 'flex-start',
  },
  logoutText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },
});
