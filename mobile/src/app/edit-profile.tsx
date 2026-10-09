import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, updateEmail } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch from firestore
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data?.name || '');
          setPhone(data?.phone || '');
          setEmail(user.email || data?.email || '');
        }
        
        // Fetch picture
        const storedPic = await AsyncStorage.getItem(`@profile_pic_${user.uid}`);
        if (storedPic) {
          setProfilePic(storedPic);
        }
      }
    };
    fetchUser();
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
      if (auth.currentUser) {
        await AsyncStorage.setItem(`@profile_pic_${auth.currentUser.uid}`, result.assets[0].uri);
      }
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name,
        phone: phone,
        email: email,
      });

      if (email !== user.email) {
        try {
          await updateEmail(user, email);
        } catch(e: any) {
          console.warn("Failed to update auth email:", e);
        }
      }

      if (newPassword.trim().length > 0) {
        await updatePassword(user, newPassword.trim());
      }

      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        window.alert('Profile updated successfully');
      }
      router.back();
    } catch (error: any) {
      if (Platform.OS !== 'web') {
        Alert.alert('Error', error.message);
      } else {
        window.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <Pressable style={styles.avatarWrapper} onPress={handlePickImage}>
            <Image source={{ uri: profilePic }} style={styles.avatar} />
            <View style={styles.cameraBtn}>
              <Icon name="camera" size={20} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>

        {/* Input Fields WhatsApp Style */}
        
        {/* Name */}
        <View style={styles.fieldContainer}>
          <View style={styles.iconBox}>
            <Icon name="person" size={24} color="#94A3B8" />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.fieldDesc}>This is not your username or pin. This name will be visible to your restaurant contacts.</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Email */}
        <View style={styles.fieldContainer}>
          <View style={styles.iconBox}>
            <Icon name="mail" size={24} color="#94A3B8" />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Password */}
        <View style={styles.fieldContainer}>
          <View style={styles.iconBox}>
            <Icon name="lock" size={24} color="#94A3B8" />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Change Password</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
            <Text style={styles.fieldDesc}>Leave blank if you don't want to change your password.</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Phone */}
        <View style={styles.fieldContainer}>
          <View style={styles.iconBox}>
            <Icon name="phone" size={24} color="#94A3B8" />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        
        <View style={{ height: 40 }} />

        <Pressable 
          style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 14,
    backgroundColor: '#075E54', // WhatsApp dark green
  },
  backBtn: { 
    width: 40, height: 40, 
    justifyContent: 'center', alignItems: 'flex-start' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontFamily: 'Inter_600SemiBold', 
    color: '#FFFFFF' 
  },
  content: { 
    paddingBottom: 40 
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F3F4F6'
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#128C7E', // WhatsApp green
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  fieldContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  iconBox: {
    width: 40,
    paddingTop: 14,
    alignItems: 'flex-start',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#128C7E',
  },
  fieldDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
    marginTop: 12,
  },
  saveBtn: { 
    backgroundColor: '#128C7E', 
    borderRadius: 24, 
    paddingVertical: 14, 
    alignItems: 'center', 
    marginHorizontal: 24,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveBtnText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontFamily: 'Inter_700Bold' 
  },
  pressed: { opacity: 0.8 },
});
