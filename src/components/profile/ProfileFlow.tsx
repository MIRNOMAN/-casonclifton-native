import DeleteAccountModal from '@/components/profile/components/DeleteAccountModal';
import { SCREEN_TITLES } from '@/components/profile/data';
import { BlurView } from 'expo-blur';
import AccountSettingsScreen from '@/components/profile/screens/AccountSettingsScreen';
import ChangePasswordScreen from '@/components/profile/screens/ChangePasswordScreen';
import FaqsScreen from '@/components/profile/screens/FaqsScreen';
import HelpSupportScreen from '@/components/profile/screens/HelpSupportScreen';
import MenuScreen from '@/components/profile/screens/MenuScreen';
import PrivacyPolicyScreen from '@/components/profile/screens/PrivacyPolicyScreen';
import TermsScreen from '@/components/profile/screens/TermsScreen';
import { styles } from '@/components/profile/styles';
import { ProfileFormValues, ScreenKey } from '@/components/profile/types';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileFlow() {
  const [screen, setScreen] = useState<ScreenKey>('menu');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [profile, setProfile] = useState<ProfileFormValues>({
    fullName: 'Ahmed Hassan',
    accountEmail: 'superproglobaldubai@yastor.glog',
    dateOfBirth: '12/06/1989',
    sex: 'Male',
    phoneNumber: '97123456789030',
  });

  const slideX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const isTransitioning = useRef(false);

  const changeScreen = (nextScreen: ScreenKey) => {
    if (nextScreen === screen || isTransitioning.current) return;

    const isGoingBackToMenu = nextScreen === 'menu';
    const fromX = isGoingBackToMenu ? -12 : 12;

    isTransitioning.current = true;
    slideX.stopAnimation();
    opacity.stopAnimation();

    setScreen(nextScreen);
    slideX.setValue(fromX);
    opacity.setValue(0.92);

    Animated.parallel([
      Animated.timing(slideX, {
        toValue: 0,
        duration: isGoingBackToMenu ? 220 : 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: isGoingBackToMenu ? 200 : 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isTransitioning.current = false;
    });
  };

  useEffect(() => {
    slideX.setValue(0);
    opacity.setValue(1);
  }, [opacity, slideX]);

  useFocusEffect(
    useCallback(() => {
      isTransitioning.current = false;
      slideX.stopAnimation();
      opacity.stopAnimation();
      slideX.setValue(0);
      opacity.setValue(1);
      setDeleteModalVisible(false);
      setScreen('menu');
    }, [opacity, slideX])
  );

  const handleLogout = () => {
    Alert.alert('Logged out', 'You have been logged out from this device.');
    router.replace('/(auth)/login');
  };

  const confirmDeleteAccount = () => {
    setDeleteModalVisible(false);
    Alert.alert('Deleted', 'Your account has been deleted successfully.');
    router.replace('/(auth)/login');
  };

  const handleHeaderBack = () => {
    if (isTransitioning.current) return;

    if (screen !== 'menu') {
      changeScreen('menu');
      return;
    }

    // Let tab navigator handle transition to avoid double-animations and shake.
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable
            onPress={handleHeaderBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
            <BlurView
              intensity={40}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <ChevronLeft size={20} color="#E8F0FF" />
          </Pressable>
          <Text style={styles.headerTitle}>{SCREEN_TITLES[screen]}</Text>
          <View style={styles.backPlaceholder} />
        </View>

        <Animated.View
          style={[styles.animatedBody, { opacity, transform: [{ translateX: slideX }] }]}>
          {screen === 'menu' ? (
            <MenuScreen
              fullName={profile.fullName}
              onNavigate={changeScreen}
              onDeleteAccount={() => setDeleteModalVisible(true)}
              onLogout={handleLogout}
            />
          ) : null}

          {screen === 'change-password' ? <ChangePasswordScreen /> : null}
          {screen === 'help-support' ? <HelpSupportScreen /> : null}
          {screen === 'faqs' ? <FaqsScreen onNavigate={changeScreen} /> : null}
          {screen === 'account-settings' ? (
            <AccountSettingsScreen profile={profile} onSave={setProfile} />
          ) : null}
          {screen === 'privacy-policy' ? <PrivacyPolicyScreen /> : null}
          {screen === 'terms' ? <TermsScreen /> : null}
        </Animated.View>

        <DeleteAccountModal
          visible={deleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={confirmDeleteAccount}
        />
      </View>
    </SafeAreaView>
  );
}
