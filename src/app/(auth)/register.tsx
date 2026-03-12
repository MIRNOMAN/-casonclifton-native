import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { COLORS } from '../../constants/colors';

const INVALID_BORDER = '#FEA08F';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isPhoneValid = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const isEmailInvalid = email.length > 0 && !EMAIL_REGEX.test(email.trim());
  const isPhoneInvalid = phone.length > 0 && !isPhoneValid(phone);
  const isPasswordInvalid = password.length > 0 && password.trim().length < 6;
  const showEmailError = emailError || isEmailInvalid;
  const showPhoneError = phoneError || isPhoneInvalid;
  const showPasswordError = passwordError || isPasswordInvalid;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = () => {
    const ee = email.trim() === '' || !EMAIL_REGEX.test(email.trim());
    const pe = phone.trim() === '' || !isPhoneValid(phone);
    const pwe = password.trim().length < 6;
    setEmailError(ee);
    setPhoneError(pe);
    setPasswordError(pwe);
    if (ee || pe || pwe) return;
    router.push('/(auth)/otp');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Logo */}
            <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
              <Image
                source={require('../../../assets/images/logo/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Form */}
            <Animated.View
              style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text className="mb-2 text-center text-[22px] leading-10.5 font-bold text-white">
                Sign up for an account
              </Text>
              <Text className="mb-8 text-center text-base leading-7 text-[#9CA3AF]">
                Enter your email and password for login
              </Text>

              {/* Email */}
              <Text className="mb-2 text-sm font-medium text-white">Email</Text>
              <View style={[styles.inputWrap, showEmailError && styles.inputError]}>
                <Mail
                  size={18}
                  color={showEmailError ? INVALID_BORDER : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) {
                      setEmailError(false);
                    }
                  }}
                  placeholder="Your email"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              {showEmailError ? (
                <Text className="mt-2 text-xs text-[#FEA08F]">Enter a valid email address.</Text>
              ) : null}

              {/* Phone */}
              <Text className="mt-5 mb-2 text-sm font-medium text-white">Phone Number</Text>
              <View style={[styles.inputWrap, showPhoneError && styles.inputError]}>
                <View style={styles.flagWrap}>
                  <Text style={styles.flagText}>🇺🇸</Text>
                </View>
                <Phone
                  size={18}
                  color={showPhoneError ? INVALID_BORDER : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (phoneError) {
                      setPhoneError(false);
                    }
                  }}
                  placeholder="+1 111-222-3344"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
              {showPhoneError ? (
                <Text className="mt-2 text-xs text-[#FEA08F]">Enter a valid phone number.</Text>
              ) : null}

              {/* Password */}
              <Text className="mt-5 mb-2 text-sm font-medium text-white">Password</Text>
              <View style={[styles.inputWrap, showPasswordError && styles.inputError]}>
                <Lock
                  size={18}
                  color={showPasswordError ? INVALID_BORDER : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (passwordError) {
                      setPasswordError(false);
                    }
                  }}
                  placeholder="Your password"
                  placeholderTextColor={COLORS.textSecondary}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                  style={styles.eyeBtn}>
                  {showPassword ? (
                    <Eye size={18} color={COLORS.textSecondary} />
                  ) : (
                    <EyeOff size={18} color={COLORS.textSecondary} />
                  )}
                </Pressable>
              </View>
              {showPasswordError ? (
                <Text className="mt-2 text-xs text-[#FEA08F]">
                  Password must be at least 6 characters.
                </Text>
              ) : null}

              <View className="mt-4 mb-7 flex-row items-center justify-between">
                <Pressable
                  className="flex-row items-center gap-2"
                  onPress={() => setRememberMe((value) => !value)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                  </View>
                  <Text className="text-sm text-white">Remember me</Text>
                </Pressable>

                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable>
                    <Text className="text-sm font-medium text-[#FEA08F]">Forgot password?</Text>
                  </Pressable>
                </Link>
              </View>

              {/* Submit */}
              <Pressable
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                onPress={handleRegister}>
                <Text className="text-base font-bold text-[#0D1117]">Sign Up</Text>
              </Pressable>

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-white">Have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <Text className="text-sm font-semibold text-[#FEA08F]">Login</Text>
                  </Pressable>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: { alignItems: 'center', marginBottom: 26, marginTop: 16 },
  logoImage: {
    width: 185,
    height: 85,
  },
  card: { width: '100%' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputError: { borderColor: INVALID_BORDER },
  flagWrap: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 20,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  eyeBtn: { paddingLeft: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: INVALID_BORDER,
    borderColor: INVALID_BORDER,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  btn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.btn,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { opacity: 0.85 },
});
