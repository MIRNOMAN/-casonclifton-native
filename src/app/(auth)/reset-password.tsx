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
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useUserResetPasswordMutation } from '@/redux/api/userApi';
import {
  clearForgotPasswordContext,
  selectForgotPasswordEmail,
  selectForgotPasswordResetToken,
} from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { toast } from 'sonner-native';

const INVALID_BORDER = '#FEA08F';

export default function ResetPasswordScreen() {
  const dispatch = useAppDispatch();
  const storedEmail = useAppSelector(selectForgotPasswordEmail);
  const storedResetToken = useAppSelector(selectForgotPasswordResetToken);
  const [userResetPassword, { isLoading }] = useUserResetPasswordMutation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [apiError, setApiError] = useState('');

  const normalizedEmail = (storedEmail || '').trim();
  const normalizedToken = (storedResetToken || '').trim();

  const isPasswordInvalid = password.length > 0 && password.trim().length < 6;
  const isConfirmInvalid =
    confirm.length > 0 && (confirm.trim().length < 6 || confirm !== password);
  const showPasswordError = passwordError || isPasswordInvalid;
  const showConfirmError = confirmError || isConfirmInvalid;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleReset = async () => {
    const pe = password.trim().length < 6;
    const ce = confirm.trim().length < 6 || confirm !== password;
    setPasswordError(pe);
    setConfirmError(ce);
    setApiError('');
    if (pe || ce) return;

    if (!normalizedEmail) {
      const message = 'Email missing. Please restart forgot password flow.';
      setApiError(message);
      toast.error(message);
      return;
    }

    if (!normalizedToken) {
      const message = 'Reset token missing or expired. Please verify OTP again.';
      setApiError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await userResetPassword({
        email: normalizedEmail,
        newPassword: password.trim(),
        confirmPassword: confirm.trim(),
        token: normalizedToken,
      }).unwrap();

      const successMessage =
        response?.data?.message || response?.message || 'Password reset successfully.';
      dispatch(clearForgotPasswordContext());

      router.replace({
        pathname: '/(auth)/reset-success',
        params: {
          message: successMessage,
          email: normalizedEmail,
        },
      });
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'Failed to reset password. Please try again.';
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
              <Text className="mt-10 mb-4 text-center text-[32px] leading-9.5 font-bold text-white">
                Create New Password
              </Text>
              <Text className="mb-10 text-center text-base leading-7 text-[#9CA3AF]">
                Your password must be different from{`\n`}previous used password
              </Text>

              {/* New password */}
              <Text className="mb-2 text-sm font-medium text-white">New Password</Text>
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
                  placeholder="Enter new password"
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

              {/* Confirm password */}
              <Text className="mt-5 mb-2 text-sm font-medium text-white">Confirm Password</Text>
              <View style={[styles.inputWrap, showConfirmError && styles.inputError]}>
                <Lock
                  size={18}
                  color={showConfirmError ? INVALID_BORDER : COLORS.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  value={confirm}
                  onChangeText={(t) => {
                    setConfirm(t);
                    if (confirmError) {
                      setConfirmError(false);
                    }
                  }}
                  placeholder="Enter new password"
                  placeholderTextColor={COLORS.textSecondary}
                  secureTextEntry={!showConfirm}
                  style={styles.input}
                />
                <Pressable
                  onPress={() => setShowConfirm((v) => !v)}
                  hitSlop={8}
                  style={styles.eyeBtn}>
                  {showConfirm ? (
                    <Eye size={18} color={COLORS.textSecondary} />
                  ) : (
                    <EyeOff size={18} color={COLORS.textSecondary} />
                  )}
                </Pressable>
              </View>
              {showConfirmError && confirm !== '' ? (
                <Text className="mt-2 text-xs text-[#FEA08F]">
                  {confirm.trim().length < 6
                    ? 'Password must be at least 6 characters.'
                    : 'Passwords do not match.'}
                </Text>
              ) : null}

              {apiError ? <Text className="mt-2 text-xs text-[#FEA08F]">{apiError}</Text> : null}

              <Pressable
                disabled={isLoading}
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                onPress={handleReset}>
                <Text className="text-base font-bold text-[#0D1117]">
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Text>
              </Pressable>
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
    marginBottom: 24,
  },
  content: {
    width: '100%',
    paddingTop: 8,
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
    marginBottom: 2,
  },
  inputError: { borderColor: INVALID_BORDER },
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
