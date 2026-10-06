import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [staffIdOrEmail, setStaffIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isFocusedId, setIsFocusedId] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');

  // Fast pre-fill helper for demo/testing
  const handleSelectQuickStaff = (email: string, name: string) => {
    setStaffIdOrEmail(email);
    setPassword('••••••••••••');
  };

  // Primary Sign In action - navigates directly to Dashboard
  const handleSignIn = () => {
    const userEmail = staffIdOrEmail.trim() || 'sarah.mitchell@restaurant.com';
    const userName = staffIdOrEmail.toLowerCase().includes('marcus') 
      ? 'Marcus Davis' 
      : 'Sarah Mitchell';
    login(userEmail, userName);
    router.replace('/');
  };

  // Fast Pass PIN sign in
  const handlePinSignIn = (enteredPin: string) => {
    if (enteredPin.length === 4) {
      setPinModalVisible(false);
      login('staff.shift@restaurant.com', 'Shift Lead / Host');
      router.replace('/');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Please request a temporary shift password from your on-duty floor manager or system administrator.',
      [{ text: 'Understood' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />

      {/* Decorative ambient background glows */}
      <View style={styles.ambientTopGlow} pointerEvents="none" />
      <View style={styles.ambientBottomGlow} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.contentWrapper}>
            {/* Header Section with increased top gap & branding */}
            <View style={styles.headerSection}>
              {/* Terminal System Pill */}
              

              {/* Logo with outer glow ring */}
              <View style={styles.logoOuterRing}>
                <View style={styles.logoBox}>
                  <Icon name="utensils" size={30} color="#FFFFFF" />
                </View>
              </View>

              {/* Header Title & Subtitle with generous spacing */}
              <Text style={styles.headerTitle}>Staff Sign In</Text>
              <Text style={styles.headerSubtitle}>
                Welcome back. Please sign in to manage reservations and floor tables.
              </Text>
            </View>

            {/* Quick Demo Staff Fill */}
            <View style={styles.quickAccessRow}>
              <Text style={styles.quickAccessLabel}>Quick Staff Login:</Text>
              <View style={styles.quickChipsRow}>
                <Pressable
                  onPress={() => handleSelectQuickStaff('sarah.mitchell@restaurant.com', 'Sarah Mitchell')}
                  style={({ pressed }) => [
                    styles.quickChip,
                    staffIdOrEmail.includes('sarah') && styles.quickChipActive,
                    pressed && styles.pressed,
                  ]}>
                  <Icon name="person" size={13} color={staffIdOrEmail.includes('sarah') ? '#009669' : '#4B5563'} />
                  <Text style={[styles.quickChipText, staffIdOrEmail.includes('sarah') && styles.quickChipTextActive]}>
                    Sarah M. (Lead)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSelectQuickStaff('marcus.davis@restaurant.com', 'Marcus Davis')}
                  style={({ pressed }) => [
                    styles.quickChip,
                    staffIdOrEmail.includes('marcus') && styles.quickChipActive,
                    pressed && styles.pressed,
                  ]}>
                  <Icon name="person" size={13} color={staffIdOrEmail.includes('marcus') ? '#009669' : '#4B5563'} />
                  <Text style={[styles.quickChipText, staffIdOrEmail.includes('marcus') && styles.quickChipTextActive]}>
                    Marcus D. (Host)
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Main Form Card Container */}
            <View style={styles.formCard}>
              {/* Field 1: Staff email or ID */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Staff Email or Employee ID</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isFocusedId && styles.inputContainerFocused,
                  ]}>
                  <View style={styles.inputIconBox}>
                    <Icon name="id-card" size={18} color={isFocusedId ? '#009669' : '#9CA3AF'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. staff@restaurant.com or ID"
                    placeholderTextColor="#9CA3AF"
                    value={staffIdOrEmail}
                    onChangeText={setStaffIdOrEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setIsFocusedId(true)}
                    onBlur={() => setIsFocusedId(false)}
                  />
                  {staffIdOrEmail.length > 0 && (
                    <Pressable onPress={() => setStaffIdOrEmail('')} hitSlop={10} style={styles.clearBtn}>
                      <Icon name="close" size={16} color="#9CA3AF" />
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Field 2: Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isFocusedPassword && styles.inputContainerFocused,
                  ]}>
                  <View style={styles.inputIconBox}>
                    <Icon name="lock" size={18} color={isFocusedPassword ? '#009669' : '#9CA3AF'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your shift password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    onFocus={() => setIsFocusedPassword(true)}
                    onBlur={() => setIsFocusedPassword(false)}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={10}
                    style={styles.eyeBtn}>
                    <Icon
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Remember Terminal & Forgot Password row */}
              <View style={styles.optionsRow}>
                <Pressable
                  onPress={() => setRememberTerminal(!rememberTerminal)}
                  style={styles.rememberRow}>
                  <View style={[styles.checkbox, rememberTerminal && styles.checkboxActive]}>
                    {rememberTerminal && <Icon name="check" size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.rememberText}>Remember terminal</Text>
                </Pressable>

                <Pressable
                  onPress={handleForgotPassword}
                  style={({ pressed }) => [
                    styles.forgotPassLink,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.forgotPassText}>Forgot password?</Text>
                </Pressable>
              </View>

              {/* Primary Sign In Button */}
              <Pressable
                onPress={handleSignIn}
                style={({ pressed }) => [
                  styles.signInBtn,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.signInBtnText}>Sign In to Terminal</Text>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>

              {/* Divider: OR FAST PASS */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR FAST PASS</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Fast Pass Secondary Button */}
              <Pressable
                onPress={() => setPinModalVisible(true)}
                style={({ pressed }) => [
                  styles.fastPassBtn,
                  pressed && styles.pressed,
                ]}>
                <View style={styles.fastPassIconBox}>
                  <Icon name="target" size={18} color="#009669" />
                </View>
                <Text style={styles.fastPassBtnText}>
                  Sign in with 4-Digit Shift PIN
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Support Info */}
          <View style={styles.footerContainer}>
            <View style={styles.footerSupportCard}>
              <View style={styles.footerSupportIconBox}>
                <Icon name="help-circle" size={16} color="#009669" />
              </View>
              <View style={styles.footerSupportTextBox}>
                <Text style={styles.footerHelpTitle}>
                  Need assistance with your shift credentials?
                </Text>
                <Text style={styles.footerHelpSubtitle}>
                  Contact Floor Manager or{' '}
                  <Text
                    onPress={() =>
                      Alert.alert(
                        'Shift Lead Support',
                        'Host Lead: Marcus D.\nExtension: #104\nDuty Office: Room 201'
                      )
                    }
                    style={styles.shiftLeadHighlight}>
                    Shift Lead (Ext #104)
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* PIN Fast Pass Modal */}
      <Modal
        visible={pinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPinModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pinCard}>
            <View style={styles.pinHeader}>
              <View style={styles.pinIconBox}>
                <Icon name="lock" size={22} color="#009669" />
              </View>
              <Text style={styles.pinTitle}>Enter Shift PIN</Text>
              <Text style={styles.pinSubtitle}>
                Enter your 4-digit quick pass security code
              </Text>
            </View>

            {/* PIN Dots */}
            <View style={styles.pinDotsRow}>
              {[0, 1, 2, 3].map((idx) => (
                <View
                  key={idx}
                  style={[
                    styles.pinDot,
                    pin.length > idx && styles.pinDotFilled,
                  ]}
                />
              ))}
            </View>

            {/* Number Keypad */}
            <View style={styles.keypadGrid}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map(
                (keyVal) => (
                  <Pressable
                    key={keyVal}
                    onPress={() => {
                      if (keyVal === 'C') {
                        setPin('');
                      } else if (keyVal === '✓') {
                        handlePinSignIn(pin.length === 4 ? pin : '1234');
                      } else if (pin.length < 4) {
                        const newPin = pin + keyVal;
                        setPin(newPin);
                        if (newPin.length === 4) {
                          setTimeout(() => handlePinSignIn(newPin), 150);
                        }
                      }
                    }}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      (keyVal === 'C' || keyVal === '✓') && styles.keypadActionBtn,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.keypadBtnText,
                        (keyVal === 'C' || keyVal === '✓') && styles.keypadSpecialText,
                      ]}>
                      {keyVal}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            <Pressable
              onPress={() => {
                setPin('');
                setPinModalVisible(false);
              }}
              style={styles.pinCancelBtn}>
              <Text style={styles.pinCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#022C22',
    position: 'relative',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    // Significantly increased top spacing as requested by the user
    paddingTop: 68,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },

  // Soft ambient mint & emerald halo glows
  ambientTopGlow: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(167, 243, 208, 0.45)',
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -110,
    right: -70,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(209, 250, 229, 0.55)',
  },

  // Header Section with generous gaps
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 150, 105, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(0, 150, 105, 0.22)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 22,
    gap: 6,
  },
  systemBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#009669',
  },
  systemBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#007A55',
    letterSpacing: 0.8,
  },
  logoOuterRing: {
    padding: 6,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 243, 208, 0.8)',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 20,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#009669',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header Typography
  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0e5407ff',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // Quick Access Chips
  quickAccessRow: {
    marginBottom: 16,
  },
  quickAccessLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  quickChipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  quickChipActive: {
    backgroundColor: '#E6F8F0',
    borderColor: '#009669',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  quickChipTextActive: {
    color: '#009669',
  },

  // Main Form Card Container
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0F241D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },

  // Form Fields
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 52,
  },
  inputContainerFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#009669',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIconBox: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
  },
  eyeBtn: {
    padding: 6,
  },

  // Options row
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 2,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#009669',
    borderColor: '#009669',
  },
  rememberText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  forgotPassLink: {
    paddingVertical: 4,
  },
  forgotPassText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#009669',
  },

  // Primary Sign In Button
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009669',
    height: 52,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 4,
  },
  signInBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginHorizontal: 12,
  },

  // Secondary Fast Pass Button
  fastPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  fastPassIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6F8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastPassBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },

  // Footer Support Info
  footerContainer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerSupportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    maxWidth: 420,
  },
  footerSupportIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSupportTextBox: {
    flex: 1,
  },
  footerHelpTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 2,
  },
  footerHelpSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  shiftLeadHighlight: {
    color: '#009669',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Pressed state
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  // PIN Fast Pass Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pinCard: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  pinHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pinIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pinTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },
  pinSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 18,
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  pinDotFilled: {
    backgroundColor: '#009669',
    borderColor: '#009669',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  keypadBtn: {
    width: '28%',
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  keypadActionBtn: {
    backgroundColor: '#F1F5F9',
  },
  keypadBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  keypadSpecialText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#009669',
  },
  pinCancelBtn: {
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  pinCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
});
