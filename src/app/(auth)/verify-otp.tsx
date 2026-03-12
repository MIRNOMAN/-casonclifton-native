import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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

const OTP_LENGTH = 6;

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setHasError(false);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.some((d) => d === '')) {
      setHasError(true);
      return;
    }
    // router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ChevronLeft size={24} color={COLORS.textPrimary} />
            </Pressable>

            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
              <Text className="mb-2 text-3xl font-bold text-white">Verify Your Email</Text>
              {email ? (
                <Text className="mb-10 text-sm text-[#9CA3AF]">
                  We sent a 6-digit code to{' '}
                  <Text className="font-semibold text-white">{email}</Text>
                </Text>
              ) : (
                <Text className="mb-10 text-sm text-[#9CA3AF]">
                  Enter the 6-digit code sent to your email.
                </Text>
              )}

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
                    cursorColor={COLORS.accent}
                  />
                ))}
              </View>

              <Pressable
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                onPress={handleVerify}>
                <Text className="text-base font-bold text-[#0D1117]">Verify Email</Text>
              </Pressable>

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-[#9CA3AF]">Didn't receive the code? </Text>
                <Pressable>
                  <Text className="text-sm font-semibold text-[#EF4444]">Resend</Text>
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
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  otpBoxFilled: { borderColor: COLORS.textSecondary },
  otpBoxError: { borderColor: COLORS.accent },
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
