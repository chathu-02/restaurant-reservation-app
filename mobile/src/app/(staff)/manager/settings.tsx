import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Platform, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@/components/ui/Icon';
import { Logo } from '@/components/logo';

export default function SettingsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [restaurantName, setRestaurantName] = useState('OceanGrace Seafood');

  useEffect(() => {
    AsyncStorage.getItem('restaurantName').then(name => {
      if (name) setRestaurantName(name);
    });
    AsyncStorage.getItem('darkMode').then(mode => {
      if (mode !== null) setDarkMode(mode === 'true');
    });
    AsyncStorage.getItem('notifications').then(notifs => {
      if (notifs !== null) setNotifications(notifs === 'true');
    });
  }, []);

  const handleSaveRestaurantName = (text: string) => {
    setRestaurantName(text);
    AsyncStorage.setItem('restaurantName', text);
  };

  const handleToggleDarkMode = (val: boolean) => {
    setDarkMode(val);
    AsyncStorage.setItem('darkMode', val.toString());
  };

  const handleToggleNotifs = (val: boolean) => {
    setNotifications(val);
    AsyncStorage.setItem('notifications', val.toString());
  };

  const isDark = darkMode;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "light-content"} backgroundColor={isDark ? "#022C22" : "#064E3B"} />
      
      {/* Top Navbar */}
      <View style={[styles.navBar, isDark && styles.navBarDark]}>
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
          <Text style={[styles.pageTitle, isDark && styles.textLight]}>System Settings</Text>
          <Text style={[styles.pageSubtitle, isDark && styles.textMutedDark]}>Configure your restaurant management system.</Text>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textLight]}>General Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, isDark && styles.textLight]}>Restaurant Name</Text>
              <Text style={[styles.settingDesc, isDark && styles.textMutedDark]}>Appears on receipts and user app.</Text>
            </View>
            <TextInput 
              style={[styles.textInput, isDark && styles.textInputDark]} 
              value={restaurantName}
              onChangeText={handleSaveRestaurantName}
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            />
          </View>
          
          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, isDark && styles.textLight]}>Push Notifications</Text>
              <Text style={[styles.settingDesc, isDark && styles.textMutedDark]}>Receive alerts for new reservations.</Text>
            </View>
            <Switch 
              value={notifications}
              onValueChange={handleToggleNotifs}
              trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: '#34D399' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, isDark && styles.textLight]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, isDark && styles.textMutedDark]}>Switch dashboard theme to dark.</Text>
            </View>
            <Switch 
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: '#34D399' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textLight]}>Account Actions</Text>
          <Pressable style={[styles.logoutButton, isDark && styles.logoutButtonDark]} onPress={() => router.replace('/(staff)/manager' as any)}>
            <Icon name="logout" size={16} color={isDark ? "#FECACA" : "#EF4444"} />
            <Text style={[styles.logoutText, isDark && styles.logoutTextDark]}>Sign Out</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomTabBar, isDark && styles.bottomTabBarDark]}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/admin-dashboard' as any)}>
          <Icon name="grid" size={22} color={isDark ? "#94A3B8" : "#475569"} />
          <Text style={[styles.tabText, isDark && styles.tabTextDark]}>Dashboard</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/expenses' as any)}>
          <Icon name="card" size={22} color={isDark ? "#94A3B8" : "#475569"} />
          <Text style={[styles.tabText, isDark && styles.tabTextDark]}>Expenses</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/reports' as any)}>
          <Icon name="chart" size={22} color={isDark ? "#94A3B8" : "#475569"} />
          <Text style={[styles.tabText, isDark && styles.tabTextDark]}>Reports</Text>
        </Pressable>
        <Pressable style={[styles.tabItemActive, isDark && styles.tabItemActiveDark]}>
          <Icon name="gear" size={22} color={isDark ? "#34D399" : "#064E3B"} />
          <Text style={[styles.tabTextActive, isDark && styles.tabTextActiveDark]}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  containerDark: { backgroundColor: '#0F172A' },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#064E3B', paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#042F2E',
  },
  navBarDark: { backgroundColor: '#022C22', borderBottomColor: '#064E3B' },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navTitle: { fontSize: 20, fontFamily: 'Inter_800ExtraBold', color: '#FFFFFF' },
  bottomTabBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0',
    position: 'absolute', bottom: 0, width: '100%',
  },
  bottomTabBarDark: { backgroundColor: '#1E293B', borderTopColor: '#334155' },
  tabItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12 },
  tabItemActive: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12, backgroundColor: '#ECFDF5' },
  tabItemActiveDark: { backgroundColor: '#022C22' },
  tabText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#94A3B8' },
  tabTextDark: { color: '#94A3B8' },
  tabTextActive: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#064E3B' },
  tabTextActiveDark: { color: '#34D399' },
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
  
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24,
    elevation: 6, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12,
  },
  cardDark: { backgroundColor: '#1E293B', shadowColor: '#000000', shadowOpacity: 0.25 },
  cardTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 20 },
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingInfo: { flex: 1, paddingRight: 16 },
  settingName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0F172A', marginBottom: 4 },
  settingDesc: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748B' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  dividerDark: { backgroundColor: '#334155' },
  
  textInput: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 14, fontFamily: 'Inter_500Medium', color: '#0F172A', width: 200,
  },
  textInputDark: { backgroundColor: '#334155', borderColor: '#475569', color: '#F8FAFC' },
  
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEF2F2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, gap: 6, marginTop: 12,
    alignSelf: 'flex-start',
  },
  logoutButtonDark: { backgroundColor: '#7F1D1D' },
  logoutText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#EF4444' },
  logoutTextDark: { color: '#FECACA' },

  textLight: { color: '#F8FAFC' },
  textMutedDark: { color: '#94A3B8' },
});
