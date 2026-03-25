import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useUserForgotPasswordMutation } from '@/redux/api/userApi';
import { setForgotPasswordEmail } from '@/redux/authSlice';
import { useAppDispatch } from '@/redux/store';
import { toast } from 'sonner-native';

const INVALID_BORDER = '#FEA08F';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const dispatch = useAppDispatch();
  const [userForgotPassword, { isLoading }] = useUserForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [apiError, setApiError] = useState('');
  const isEmailInvalid = email.length > 0 && !EMAIL_REGEX.test(email.trim());
  const showEmailError = emailError || isEmailInvalid;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    const value = email.trim();
    if (value === '' || !EMAIL_REGEX.test(value)) {
      setEmailError(true);
      return;
    }

    setApiError('');

    try {
      const response = await userForgotPassword({ email: value }).unwrap();
      dispatch(setForgotPasswordEmail(value));
      toast.success(response.message || 'Password reset code sent successfully.');
      router.push({
        pathname: '/(auth)/forgot-otp',
        params: { contact: value },
      });
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'Failed to send OTP. Please try again.';
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          {/* Back */}
          <Pressable style={styles.backBtn} onPress={() => router.replace('/(auth)/login')}>
            <ChevronLeft size={24} color={COLORS.textPrimary} />
          </Pressable>

          <Animated.View
            style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text className="mt-10 mb-3 text-center text-[34px] leading-9.5 font-bold text-white">
              Forgot Password?
            </Text>
            <Text className="mb-10 text-center text-base leading-7 text-[#9CA3AF]">
              Please insert your email or number phone{`\n`}to send link reset password
            </Text>

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
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {showEmailError ? (
              <Text className="mt-2 text-xs text-[#FEA08F]">Enter a valid email address.</Text>
            ) : null}

            {apiError ? <Text className="mt-2 text-xs text-[#FEA08F]">{apiError}</Text> : null}

            <Pressable
              disabled={isLoading}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              onPress={handleSubmit}>
              <Text className="text-base font-bold text-[#0D1117]">
                {isLoading ? 'Sending...' : 'Send Code'}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  content: {
    width: '100%',
    paddingTop: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  inputError: { borderColor: INVALID_BORDER },
  icon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  btn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.btn,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnPressed: { opacity: 0.85 },
});
