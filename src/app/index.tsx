import DotSpinner from '@/components/common/DotSpinner';
import { COLORS } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <Image
        source={require('../../assets/images/backround/backround.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.logoBlock}>
          <Image
            source={require('../../assets/images/logo/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

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
    backgroundColor: COLORS.background,
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
