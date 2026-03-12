import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { COLORS } from '../../constants/colors';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = () => {
    const ne = name.trim() === '';
    const ee = email.trim() === '';
    const pe = password.trim() === '';
    setNameError(ne);
    setEmailError(ee);
    setPasswordError(pe);
    if (ne || ee || pe) return;
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
              <View style={styles.logoRing}>
                <View style={styles.logoInner} />
                <View style={styles.logoDot} />
              </View>
              <Text className="mt-2 text-xl font-bold tracking-[4px] text-white">CRESTCON</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text className="mb-1 text-3xl font-bold text-white">Create Account</Text>
              <Text className="mb-7 text-sm text-[#9CA3AF]">Sign up to get started</Text>

              {/* Full name */}
              <Text className="mb-2 text-sm font-medium text-white">Full Name</Text>
              <View style={[styles.inputWrap, nameError && styles.inputError]}>
                <User
                  size={18}
                  color={nameError ? COLORS.accent : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    setNameError(false);
                  }}
                  placeholder="Your name"
                  placeholderTextColor={COLORS.textSecondary}
                  style={styles.input}
                />
              </View>

              {/* Email */}
              <Text className="mt-5 mb-2 text-sm font-medium text-white">Email</Text>
              <View style={[styles.inputWrap, emailError && styles.inputError]}>
                <Mail
                  size={18}
                  color={emailError ? COLORS.accent : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setEmailError(false);
                  }}
                  placeholder="Your email"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              {/* Password */}
              <Text className="mt-5 mb-2 text-sm font-medium text-white">Password</Text>
              <View style={[styles.inputWrap, passwordError && styles.inputError]}>
                <Lock
                  size={18}
                  color={passwordError ? COLORS.accent : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setPasswordError(false);
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

              {/* Submit */}
              <Pressable
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                onPress={handleRegister}>
                <Text className="text-base font-bold text-[#0D1117]">Register</Text>
              </Pressable>

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-[#9CA3AF]">Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <Text className="text-sm font-semibold text-[#EF4444]">Login</Text>
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
  logoSection: { alignItems: 'center', marginBottom: 36, marginTop: 16 },
  logoRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoInner: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#FFF' },
  logoDot: {
    position: 'absolute',
    bottom: 8,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
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
  inputError: { borderColor: COLORS.accent },
  icon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  eyeBtn: { paddingLeft: 8 },
  btn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.btn,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  btnPressed: { opacity: 0.85 },
});
