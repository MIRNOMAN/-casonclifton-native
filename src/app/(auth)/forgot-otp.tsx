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
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useForgotOtpSendMutation, useUserForgotPasswordMutation } from '@/redux/api/userApi';
import { selectForgotPasswordEmail } from '@/redux/authSlice';
import { useAppSelector } from '@/redux/store';
import { toast } from 'sonner-native';

const OTP_LENGTH = 6;
const INVALID_BORDER = '#FEA08F';

export default function ForgotOtpScreen() {
  const { contact } = useLocalSearchParams<{ contact?: string }>();
  const storedEmail = useAppSelector(selectForgotPasswordEmail);
  const [forgotOtpSend, { isLoading }] = useForgotOtpSendMutation();
  const [userForgotPassword, { isLoading: isResending }] = useUserForgotPasswordMutation();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [hasError, setHasError] = useState(false);
  const [apiError, setApiError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const normalizedContact = (contact || storedEmail || '').trim();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 250);

    return () => clearTimeout(focusTimer);
  }, [fadeAnim, slideAnim]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setHasError(false);
    setApiError('');
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    if (!normalizedContact) {
      const message = 'Email not found. Please go back and request OTP again.';
      setApiError(message);
      toast.error(message);
      return;
    }

    if (otp.some((d) => d === '')) {
      setHasError(true);
      return;
    }

    try {
      const otpCode = otp.join('');
      const response = await forgotOtpSend({
        email: normalizedContact,
        otp: otpCode,
      }).unwrap();

      console.log('Forgot OTP verified:', {
        email: normalizedContact,
        otp: otpCode,
        response,
      });
      toast.success(response.message || 'OTP verified successfully.');

      router.push({
        pathname: '/(auth)/reset-password',
        params: response?.data?.resetToken ? { resetToken: response.data.resetToken } : undefined,
      });
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'OTP verification failed. Please try again.';
      setApiError(message);
      setHasError(true);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!normalizedContact) {
      const message = 'Email not found. Please go back and enter your email again.';
      setApiError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await userForgotPassword({ email: normalizedContact }).unwrap();
      toast.success(response.message || 'OTP resent successfully.');
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'Failed to resend OTP. Please try again.';
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
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={20} color={COLORS.textPrimary} />
          </Pressable>

          <Animated.View
            style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text className="mt-10 mb-5 text-center text-[32px] leading-9.5 font-bold text-white">
              Verification Code
            </Text>
            <Text className="mb-10 text-center text-base leading-7 text-[#9CA3AF]">
              We have sent code to your email
              {`\n`}
              {normalizedContact || 'john.doe@example.com'}
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => {
                    inputRefs.current[i] = r;
                  }}
                  value={digit}
                  onChangeText={(v) => handleChange(v, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpBox,
                    digit !== '' && styles.otpBoxFilled,
                    hasError && styles.otpBoxError,
                  ]}
                  cursorColor={INVALID_BORDER}
                />
              ))}
            </View>

            {apiError ? <Text className="mb-3 text-xs text-[#FEA08F]">{apiError}</Text> : null}

            <Pressable
              disabled={isLoading}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              onPress={handleVerify}>
              <Text className="text-base font-bold text-[#0D1117]">
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </Pressable>

            <View className="mt-6 flex-row items-center justify-center">
              <Text className="text-sm text-[#9CA3AF]">Didn't receive the code? </Text>
              <Pressable onPress={handleResend} disabled={isResending}>
                <Text className="text-sm font-semibold text-[#FEA08F]">
                  {isResending ? 'Sending...' : 'Resend'}
                </Text>
              </Pressable>
            </View>
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
    marginBottom: 28,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 18 },
  otpBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  otpBoxFilled: { borderColor: COLORS.border },
  otpBoxError: { borderColor: INVALID_BORDER },
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
