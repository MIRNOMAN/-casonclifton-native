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
import { Mail, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    if (email.trim() === '') {
      setEmailError(true);
      return;
    }
    router.push('/(auth)/forgot-otp');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            {/* Back */}
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ChevronLeft size={24} color={COLORS.textPrimary} />
            </Pressable>

            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
              <Text className="mb-2 text-3xl font-bold text-white">Forgot Password?</Text>
              <Text className="mb-8 text-sm text-[#9CA3AF]">
                Enter your email address and we'll send you a verification code.
              </Text>

              <Text className="mb-2 text-sm font-medium text-white">Email</Text>
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

              <Pressable
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                onPress={handleSubmit}>
                <Text className="text-base font-bold text-[#0D1117]">Send Code</Text>
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
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
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
  inputError: { borderColor: COLORS.accent },
  icon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
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
