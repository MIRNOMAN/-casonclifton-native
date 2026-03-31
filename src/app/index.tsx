import DotSpinner from '@/components/common/DotSpinner';
import { COLORS } from '@/constants/colors';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();

  // 1. Get the token from Redux state reactively
  const authToken = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    // 2. Set a single timeout to handle navigation logic
    const timeout = setTimeout(() => {
      if (authToken) {
        // Replace current route so user can't go "back" to splash
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 3000); // 3 seconds is usually enough for a logo reveal

    return () => clearTimeout(timeout);
  }, [authToken, router]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        source={require('../../assets/images/backround/backround.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Content Overlay */}
      <View style={styles.overlay}>
        <View style={styles.logoBlock}>
          <Image
            source={require('../../assets/images/logo/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Loading Indicator */}
        <View style={styles.spinnerWrap}>
          <DotSpinner size={36} color="#FFFFFF" speed={120} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background || '#000',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoBlock: {
    alignItems: 'center',
    marginTop: 40,
    justifyContent: 'center',
  },
  logoImage: {
    width: 290,
    height: 120,
  },
  spinnerWrap: {
    position: 'absolute',
    bottom: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
