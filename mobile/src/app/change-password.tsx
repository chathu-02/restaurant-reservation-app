import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { changeCustomerPassword } from '@/lib/profileService';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Field validation errors
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [newError, setNewError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isDirty = currentPassword || newPassword || confirmPassword;

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved password entries. Do you want to cancel and go back?',
        [
          { text: 'Stay Here', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (busy) return;

    let hasError = false;

    // 1. Current password
    if (!currentPassword) {
      setCurrentError('Please enter your current password.');
      hasError = true;
    } else {
      setCurrentError(null);
    }

    // 2. New password
    if (!newPassword) {
      setNewError('Please enter a new password.');
      hasError = true;
    } else if (newPassword.length < 6) {
      setNewError('New password must be at least 6 characters.');
      hasError = true;
    } else if (newPassword === currentPassword) {
      setNewError('New password cannot be the same as your current password.');
      hasError = true;
    } else {
      setNewError(null);
    }

    // 3. Confirm password
    if (!confirmPassword) {
      setConfirmError('Please confirm your new password.');
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      setConfirmError('New passwords do not match.');
      hasError = true;
    } else {
      setConfirmError(null);
    }

    if (hasError) {
      return;
    }

    setBusy(true);
    try {
      await changeCustomerPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert('Success', 'Password changed successfully.', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      const msg = err?.message || 'Failed to update password. Please check your credentials.';
      if (msg.includes('Current password is incorrect')) {
        setCurrentError('Current password is incorrect.');
      }
      Alert.alert('Unable to Change Password', msg);
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
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={handleBack}
          >
            <Icon name="chevron-left" size={20} color="#111827" />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Change Password</Text>
            <Text style={styles.headerSubtitle}>Account Security</Text>
          </View>

          <View style={{ width: 38 }} />
        </View>

        {/* Info Banner */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Icon name="lock" size={20} color="#009669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Keep your account secure</Text>
            <Text style={styles.infoSub}>
              Choose a strong password with at least 6 characters. Do not reuse your current password.
            </Text>
          </View>
        </View>

        {/* Password Form Card */}
        <View style={styles.formCard}>
          {/* CURRENT PASSWORD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CURRENT PASSWORD</Text>
            <View style={[styles.inputBox, currentError ? styles.inputBoxError : null]}>
              <Icon name="lock" size={18} color={currentError ? '#EF4444' : '#9CA3AF'} />
              <TextInput
                style={styles.textInput}
                value={currentPassword}
                onChangeText={(t) => {
                  setCurrentPassword(t);
                  if (currentError) setCurrentError(null);
                }}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                <Icon name={showCurrent ? 'eye' : 'eye-off'} size={18} color="#6B7280" />
              </Pressable>
            </View>
            {currentError && (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{currentError}</Text>
              </View>
            )}
          </View>

          {/* NEW PASSWORD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
            <View style={[styles.inputBox, newError ? styles.inputBoxError : null]}>
              <Icon name="lock" size={18} color={newError ? '#EF4444' : '#9CA3AF'} />
              <TextInput
                style={styles.textInput}
                value={newPassword}
                onChangeText={(t) => {
                  setNewPassword(t);
                  if (newError) setNewError(null);
                }}
                placeholder="Enter at least 6 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNew}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                <Icon name={showNew ? 'eye' : 'eye-off'} size={18} color="#6B7280" />
              </Pressable>
            </View>
            {newError && (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{newError}</Text>
              </View>
            )}
          </View>

          {/* CONFIRM NEW PASSWORD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CONFIRM NEW PASSWORD</Text>
            <View style={[styles.inputBox, confirmError ? styles.inputBoxError : null]}>
              <Icon name="lock" size={18} color={confirmError ? '#EF4444' : '#9CA3AF'} />
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (confirmError) setConfirmError(null);
                }}
                placeholder="Re-type new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Icon name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#6B7280" />
              </Pressable>
            </View>
            {confirmError && (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{confirmError}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              busy && styles.btnDisabled,
              pressed && !busy && styles.pressed,
            ]}
            onPress={handleSubmit}
            disabled={busy}
          >
            {busy ? (
              <>
                <ActivityIndicator size="small" color="#00E599" />
                <Text style={styles.submitBtnText}>Updating Password...</Text>
              </>
            ) : (
              <>
                <Icon name="check" size={18} color="#00E599" />
                <Text style={styles.submitBtnText}>Update Password</Text>
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E8FAF0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,180,120,0.2)',
    padding: 14,
    marginBottom: 16,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  infoSub: {
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
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
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginLeft: 2,
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
  eyeBtn: {
    padding: 6,
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
  buttonContainer: {
    gap: 10,
  },
  submitBtn: {
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
  submitBtnText: {
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
