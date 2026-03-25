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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useCreateUserLoginMutation } from '@/redux/api/userApi';
import { setUser } from '@/redux/authSlice';
import { useAppDispatch } from '@/redux/store';
import { toast } from 'sonner-native';

const INVALID_BORDER = '#FEA08F';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [createUserLogin, { isLoading }] = useCreateUserLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [apiError, setApiError] = useState('');

  const isEmailInvalid = email.length > 0 && !EMAIL_REGEX.test(email.trim());
  const isPasswordInvalid = password.length > 0 && password.length < 6;
  const showEmailError = emailError || isEmailInvalid;
  const showPasswordError = passwordError || isPasswordInvalid;

  // ── Entrance animations ──────────────────────────────────
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(formAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    const isEmailEmpty = email.trim() === '';
    const isEmailFormatInvalid = !EMAIL_REGEX.test(email.trim());
    const isPasswordTooShort = password.trim().length < 6;

    setEmailError(isEmailEmpty || isEmailFormatInvalid);
    setPasswordError(isPasswordTooShort);
    setApiError('');

    if (isEmailEmpty || isEmailFormatInvalid || isPasswordTooShort) return;

    try {
      const response = await createUserLogin({
        email: email.trim(),
        password,
        rememberMe,
      }).unwrap();

      dispatch(
        setUser({
          role: response.data.role,
          accessToken: response.data.accessToken,
          user: {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
          },
        })
      );

      console.log('Login successful:', response.data);
      toast.success('User logged in successfully');

      router.replace('/(tabs)');
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error ||
        'Login failed. Please check your email and password.';
      setApiError(message);
      toast.error(message);
    }
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
            {/* ── Logo ── */}
            <Image
              source={require('../../../assets/images/logo/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />

            {/* ── Form card ── */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: formAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              {/* Heading */}
              <Text className="mb-1 text-3xl font-bold text-white">Hi, Welcome Back</Text>
              <Text className="mb-7 text-sm text-[#9CA3AF] md:text-base">
                Login in to your account
              </Text>

              {/* Email */}
              <Text className="mb-2 text-sm font-medium text-white">Email</Text>
              <View style={[styles.inputWrap, showEmailError && styles.inputError]}>
                <Mail
                  size={18}
                  color={showEmailError ? INVALID_BORDER : COLORS.textSecondary}
                  style={styles.inputIcon}
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

              {/* Password */}
              <Text className="mt-5 mb-2 text-sm font-medium text-white">Password</Text>
              <View style={[styles.inputWrap, showPasswordError && styles.inputError]}>
                <Lock
                  size={18}
                  color={showPasswordError ? INVALID_BORDER : COLORS.textSecondary}
                  style={styles.inputIcon}
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

              {apiError ? <Text className="mt-3 text-xs text-[#FEA08F]">{apiError}</Text> : null}

              {/* Remember me + Forgot password */}
              <View className="mt-4 mb-7 flex-row items-center justify-between">
                <Pressable
                  className="flex-row items-center gap-2"
                  onPress={() => setRememberMe((v) => !v)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text className="text-sm text-[#9CA3AF]">Remember me</Text>
                </Pressable>

                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable>
                    <Text className="text-sm font-medium text-[#FEA08F]">Forgot password?</Text>
                  </Pressable>
                </Link>
              </View>

              {/* Login button */}
              <Pressable
                disabled={isLoading}
                onPress={handleLogin}
                style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}>
                <Text className="text-base font-bold text-[#0D1117]">
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </Pressable>

              {/* Register link */}
              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-[#9CA3AF]">Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <Pressable>
                    <Text className="text-sm font-semibold text-[#FEA08F]">Register</Text>
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
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Logo ─────────────────────────────────────────────────
  logoSection: {
    alignItems: 'center',
    marginBottom: 36,
    marginTop: 16,
  },
  logoImage: {
    width: 220,
    height: 90,
    marginBottom: 60,
  },
  // ── Form ─────────────────────────────────────────────────
  card: {
    width: '100%',
  },

  // ── Input ────────────────────────────────────────────────
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
  inputError: {
    borderColor: INVALID_BORDER,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  eyeBtn: {
    paddingLeft: 8,
  },

  // ── Checkbox ─────────────────────────────────────────────
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
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },

  // ── Login button ─────────────────────────────────────────
  loginBtn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.btn,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnPressed: {
    opacity: 0.85,
  },
});
