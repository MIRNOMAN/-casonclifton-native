import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useRegisterOtpVerificationMutation, useResendOtpMutation } from '@/redux/api/userApi';
import { toast } from 'sonner-native';

const OTP_LENGTH = 6;
const ACTIVE_BORDER = '#FEA08F';

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [registerOtpVerification, { isLoading }] = useRegisterOtpVerificationMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [hasError, setHasError] = useState(false);
  const [apiError, setApiError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const normalizedEmail = (email || '').trim();

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
    if (value && index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
      return;
    }
    setActiveIndex(index);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!normalizedEmail) {
      const message = 'Email not found. Please go back and register again.';
      setApiError(message);
      toast.error(message);
      return;
    }

    if (otp.some((d) => d === '')) {
      setHasError(true);
      return;
    }

    setApiError('');

    try {
      const otpCode = otp.join('');
      const response = await registerOtpVerification({
        email: normalizedEmail,
        otp: otpCode,
      }).unwrap();

      toast.success(response.message || 'Email verified successfully.');
      router.replace('/(auth)/aggrement');
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'OTP verification failed. Please try again.';
      setApiError(message);
      setHasError(true);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!normalizedEmail) {
      const message = 'Email not found. Please go back.';
      setApiError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await resendOtp({
        email: normalizedEmail,
      }).unwrap();

      toast.success(response?.data?.message || response?.message || 'OTP resent successfully.');
      setOtp(Array(OTP_LENGTH).fill(''));
      setHasError(false);
      setApiError('');
      inputRefs.current[0]?.focus();
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ChevronLeft size={22} color={COLORS.textPrimary} />
            </Pressable>

            <Animated.View
              style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}>
              <Image
                source={require('../../../assets/images/logo/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />

              <Text className="mt-10 mb-4 text-center text-[32px] leading-9.5 font-bold text-white">
                Verify identity
              </Text>
              <Text className="mb-10 text-center text-base leading-7 text-[#9CA3AF]">
                We have sent code to your email{`\n`}
                {normalizedEmail || 'your-email@example.com'}
              </Text>

              {/* OTP boxes */}
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
                    onFocus={() => setActiveIndex(i)}
                    style={[
                      styles.otpBox,
                      digit !== '' && styles.otpBoxFilled,
                      activeIndex === i && styles.otpBoxActive,
                      hasError && styles.otpBoxError,
                    ]}
                    cursorColor={ACTIVE_BORDER}
                  />
                ))}
              </View>

              {apiError ? (
                <Text className="mt-4 text-center text-xs text-[#FEA08F]">{apiError}</Text>
              ) : null}

              <Pressable
                disabled={isLoading}
                style={({ pressed }) => [styles.verifyBtn, pressed && styles.verifyBtnPressed]}
                onPress={handleVerify}>
                <Text className="text-base font-bold text-[#0D1117]">
                  {isLoading ? 'Verifying...' : 'Verify Code'}
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
        </TouchableWithoutFeedback>
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
    marginBottom: 18,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  logoImage: {
    width: 150,
    height: 72,
    marginBottom: 26,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 18 },
  otpBox: {
    width: 50,
    height: 50,
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
  otpBoxActive: { borderColor: ACTIVE_BORDER },
  otpBoxError: { borderColor: ACTIVE_BORDER },
  verifyBtn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.btn,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  verifyBtnPressed: { opacity: 0.85 },
});
