import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';

export default function OnboardingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            {/* Logo */}
            <Animated.View
              style={[
                styles.logoSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner} />
                <View style={styles.logoDot} />
              </View>
              <Text className="mt-3 text-xl font-bold tracking-[4px] text-white">CRESTCON</Text>
            </Animated.View>

            {/* CTA */}
            <Animated.View
              style={[styles.cta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text className="mb-2 text-center text-3xl font-bold text-white">
                Welcome to{'\n'}Crestcon
              </Text>
              <Text className="mb-10 text-center text-sm text-[#9CA3AF]">
                Your trusted platform. Sign in or create an account to get started.
              </Text>

              <Pressable
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
                onPress={() => router.push('/(auth)/login')}>
                <Text className="text-base font-bold text-[#0D1117]">Login</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnPressed]}
                onPress={() => router.push('/(auth)/register')}>
                <Text className="text-base font-bold text-white">Register</Text>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: { alignItems: 'center' },
  logoRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoInner: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
  logoDot: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  cta: { width: '100%' },
  btnPrimary: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.btn,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  btnSecondary: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnPressed: { opacity: 0.85 },
});
