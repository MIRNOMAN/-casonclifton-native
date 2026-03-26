import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/colors';

export default function ResetSuccessScreen() {
  const { message, email } = useLocalSearchParams<{ message?: string; email?: string }>();

  const successBody =
    typeof message === 'string' && message.trim().length > 0
      ? message
      : 'Your password has been reset successfully.';

  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          <Text className="mt-8 mb-3 text-center text-[34px] leading-10 font-bold text-white">
            Password Reset!{'\n'}Successful
          </Text>
          <Text className="mb-12 text-center text-base leading-7 text-[#9CA3AF]">
            {successBody}
            {'\n'}
            {normalizedEmail
              ? `You can now log in with ${normalizedEmail}.`
              : 'You can now log in with your new password.'}
          </Text>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-base font-bold text-[#0D1117]">Back to Login</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  content: { width: '100%', alignItems: 'center' },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEA08F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: '#FFFFFF', fontSize: 44, fontWeight: '700', lineHeight: 50 },
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
