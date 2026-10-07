import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../components/ui/Icon';

export default function StaffLoginScreen() {
  const router = useRouter();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTroubleModalVisible, setIsTroubleModalVisible] = useState(false);
  const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);

  const handleSignIn = () => {
    if (!emailOrId.trim()) {
      setErrorMsg('Please enter your staff email or ID');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    setErrorMsg('');
    router.push('/dashboard');
  };

  const handleQuickFill = (role: 'manager' | 'staff') => {
    if (role === 'manager') {
      setEmailOrId('kaweerna.sneha@email.com');
      setPassword('manager123');
    } else {
      setEmailOrId('jane.doe@restaurant.com');
      setPassword('staff123');
    }
    setErrorMsg('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar with Time & Back Button */}
        <View style={styles.statusBarRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/customer-profile');
              }
            }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={22} color="#374151" />
          </TouchableOpacity>
          <View style={styles.clockIndicator}>
            <Text style={styles.clockText}>9:41</Text>
          </View>
        </View>

        {/* Utensils Logo & STAFF ACCESS Badge */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Icon name="utensils" size={32} color="#00E599" />
          </View>

          <View style={styles.staffAccessPill}>
            <View style={styles.greenDot} />
            <Text style={styles.staffAccessText}>STAFF ACCESS</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Staff sign in</Text>
          <Text style={styles.subtitleText}>
            For restaurant team members & managers
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="close" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Email / ID Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Staff email or ID</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. staff@restaurant.com or ID"
                placeholderTextColor="#9CA3AF"
                value={emailOrId}
                onChangeText={(text) => {
                  setEmailOrId(text);
                  setErrorMsg('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordHeaderRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity
                onPress={() => setIsForgotModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.textInput, { paddingRight: 45 }]}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMsg('');
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIconBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
            <Icon name="arrow-right" size={18} color="#00E599" />
          </TouchableOpacity>

          {/* Quick Demo Fill Buttons */}
          <View style={styles.quickFillRow}>
            <Text style={styles.quickFillLabel}>Quick Fill:</Text>
            <TouchableOpacity
              style={styles.quickFillPillManager}
              onPress={() => handleQuickFill('manager')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickFillPillManagerText}>Manager (Kaweerna)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickFillPillStaff}
              onPress={() => handleQuickFill('staff')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickFillPillStaffText}>Staff (Jane)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trouble Signing In Card */}
        <TouchableOpacity
          style={styles.troubleCard}
          onPress={() => setIsTroubleModalVisible(true)}
          activeOpacity={0.75}
        >
          <View style={styles.helpIconCircle}>
            <Icon name="help" size={20} color="#009669" />
          </View>
          <View style={styles.troubleTextContainer}>
            <Text style={styles.troubleSmallText}>Trouble signing in?</Text>
            <Text style={styles.troubleBoldText}>Contact restaurant manager</Text>
          </View>
          <Icon name="chevron-right" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </ScrollView>

      {/* Trouble Assistance Modal */}
      <Modal
        visible={isTroubleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTroubleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Staff Access Assistance</Text>
              <TouchableOpacity
                onPress={() => setIsTroubleModalVisible(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Terminal login & credential recovery
            </Text>

            <Text style={styles.modalBodyText}>
              Staff credentials are automatically provisioned by your general operations manager during onboarding.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Floor Manager Hotline:</Text>
              <Text style={styles.infoBoxValue}>+1 (800) 555-STITCH (Ext 401)</Text>
              <Text style={styles.infoBoxTitle}>Station Shift:</Text>
              <Text style={styles.infoBoxValue}>Duty Supervisor Zone A</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsTroubleModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        visible={isForgotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Password / PIN</Text>
              <TouchableOpacity
                onPress={() => setIsForgotModalVisible(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Request temporary passcode from manager
            </Text>

            <Text style={styles.modalBodyText}>
              Please request a temporary 6-digit one-time passcode from the on-duty floor manager (Kaweerna Sneha) at the host terminal.
            </Text>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsForgotModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
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
    paddingHorizontal: 22,
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  statusBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clockIndicator: {
    paddingHorizontal: 8,
  },
  clockText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#181A1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  staffAccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#E8FAF0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00B37E',
  },
  staffAccessText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.8,
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
  formContainer: {
    gap: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  passwordHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#009669',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#111827',
  },
  eyeIconBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  signInButton: {
    backgroundColor: '#181A1E',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickFillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  quickFillLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  quickFillPillManager: {
    backgroundColor: '#E8FAF0',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  quickFillPillManagerText: {
    fontSize: 11,
    color: '#00875A',
    fontWeight: '700',
  },
  quickFillPillStaff: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  quickFillPillStaffText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  troubleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  helpIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E8FAF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  troubleTextContainer: {
    flex: 1,
  },
  troubleSmallText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  troubleBoldText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
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
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 14,
  },
  modalBodyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 14,
  },
  infoBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 4,
  },
  infoBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  infoBoxValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  modalCloseButton: {
    backgroundColor: '#181A1E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
