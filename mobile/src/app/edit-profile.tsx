import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import {
  getCustomerProfileSync,
  loadCustomerProfile,
  updateCustomerProfile,
  pickImageFromLibrary,
  takePhotoWithCamera,
} from '@/lib/profileService';
import { validateAndNormalizeSriLankanPhone } from '@/lib/queueService';

export default function EditProfileScreen() {
  const initial = getCustomerProfileSync();
  const initPhoneParsed = validateAndNormalizeSriLankanPhone(initial.phone);

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(
    initPhoneParsed.isValid ? initPhoneParsed.displayLocal : initial.phone
  );
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadCustomerProfile().then((p) => {
      setName(p.name);
      setEmail(p.email);
      const parsed = validateAndNormalizeSriLankanPhone(p.phone);
      setPhone(parsed.isValid ? parsed.displayLocal : p.phone);
      setPhotoUrl(p.photoUrl);
    });
  }, []);

  // Field validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Dirty check
  const isDirty =
    name !== initial.name ||
    email !== initial.email ||
    phone !== (initPhoneParsed.isValid ? initPhoneParsed.displayLocal : initial.phone) ||
    photoUrl !== initial.photoUrl;

  const handlePickImage = () => {
    const handleLibrary = async () => {
      try {
        const uri = await pickImageFromLibrary();
        if (uri) setPhotoUrl(uri);
      } catch (err: any) {
        Alert.alert('Image Selection Failed', err?.message || 'Could not pick image.');
      }
    };

    const handleCamera = async () => {
      try {
        const uri = await takePhotoWithCamera();
        if (uri) setPhotoUrl(uri);
      } catch (err: any) {
        Alert.alert('Camera Failed', err?.message || 'Could not take photo.');
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose from Photo Library', 'Take Photo with Camera'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleLibrary();
          if (buttonIndex === 2) handleCamera();
        }
      );
    } else {
      Alert.alert('Change Profile Picture', 'Select an option to update your photo:', [
        { text: 'Choose from Library', onPress: handleLibrary },
        { text: 'Take Photo', onPress: handleCamera },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Unsaved Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Stay Here', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (busy) return;

    let hasError = false;

    // 1. Name validation
    if (!name.trim()) {
      setNameError('Please enter your full name.');
      hasError = true;
    } else {
      setNameError(null);
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError(null);
    }

    // 3. Phone validation
    const phoneRes = validateAndNormalizeSriLankanPhone(phone);
    if (!phoneRes.isValid) {
      setPhoneError(phoneRes.error || 'Please enter a valid Sri Lankan phone number.');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (hasError) {
      Alert.alert('Invalid Information', 'Please correct the highlighted errors before saving.');
      return;
    }

    setBusy(true);
    try {
      await updateCustomerProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phoneRes.normalized,
        photoUrl,
      });

      Alert.alert('Success', 'Profile updated successfully.', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Unable to Save Changes', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={handleBack}
          >
            <Icon name="chevron-left" size={20} color="#111827" />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Personal Details</Text>
            <Text style={styles.headerSubtitle}>Customer Profile & Account</Text>
          </View>

          <View style={{ width: 38 }} />
        </View>

        {/* Avatar Upload Card */}
        <View style={styles.avatarCard}>
          <Pressable
            style={({ pressed }) => [styles.avatarWrapper, pressed && styles.pressed]}
            onPress={handlePickImage}
          >
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={14} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
          <Text style={styles.avatarSub}>Supports Photo Library and Camera</Text>
        </View>

        {/* Input Fields Card */}
        <View style={styles.formCard}>
          {/* FULL NAME */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <View style={[styles.inputBox, nameError ? styles.inputBoxError : null]}>
              <Icon name="person" size={18} color={nameError ? '#EF4444' : '#9CA3AF'} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (nameError) setNameError(null);
                }}
                placeholder="Full name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>
            {nameError && (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{nameError}</Text>
              </View>
            )}
          </View>

          {/* EMAIL ADDRESS */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
              <Icon name="card" size={18} color={emailError ? '#EF4444' : '#9CA3AF'} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (emailError) setEmailError(null);
                }}
                placeholder="Email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError && (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            )}
          </View>

          {/* SRI LANKAN PHONE NUMBER */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              <Text style={styles.helperText}>Sri Lanka (+94)</Text>
            </View>
            <View style={[styles.phoneBox, phoneError ? styles.inputBoxError : null]}>
              <View style={styles.countryBadge}>
                <Text style={styles.flagEmoji}>🇱🇰</Text>
                <Text style={styles.countryCode}>+94</Text>
              </View>
              <View style={styles.vDivider} />
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  if (phoneError) setPhoneError(null);
                }}
                placeholder="077 123 4567 or 771234567"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
            {phoneError ? (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{phoneError}</Text>
              </View>
            ) : (
              <Text style={styles.phoneHint}>
                Local mobile format: 070, 071, 072, 074, 075, 076, 077, 078
              </Text>
            )}
          </View>
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              busy && styles.btnDisabled,
              pressed && !busy && styles.pressed,
            ]}
            onPress={handleSave}
            disabled={busy}
          >
            {busy ? (
              <>
                <ActivityIndicator size="small" color="#00E599" />
                <Text style={styles.saveBtnText}>Saving Changes...</Text>
              </>
            ) : (
              <>
                <Icon name="check" size={18} color="#00E599" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
            onPress={handleBack}
            disabled={busy}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009669',
    marginTop: 2,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#A7F3D0',
    backgroundColor: '#E5E7EB',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#181A1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarHint: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  avatarSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 20,
    gap: 14,
  },
  fieldGroup: {
    marginBottom: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  inputBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 48,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: 10,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  phoneHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    gap: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#181A1E',
    borderRadius: 18,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
});
