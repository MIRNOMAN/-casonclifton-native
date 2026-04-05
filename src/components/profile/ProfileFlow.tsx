import DeleteAccountModal from '@/components/profile/components/DeleteAccountModal';
import { SCREEN_TITLES } from '@/components/profile/data';
import AccountSettingsScreen from '@/components/profile/screens/AccountSettingsScreen';
import ChangePasswordScreen from '@/components/profile/screens/ChangePasswordScreen';
import FaqsScreen from '@/components/profile/screens/FaqsScreen';
import HelpSupportScreen from '@/components/profile/screens/HelpSupportScreen';
import MenuScreen from '@/components/profile/screens/MenuScreen';
import PrivacyPolicyScreen from '@/components/profile/screens/PrivacyPolicyScreen';
import TermsScreen from '@/components/profile/screens/TermsScreen';
import { styles } from '@/components/profile/styles';
import { ProfileFormValues, ScreenKey } from '@/components/profile/types';
import { useGetMeUserQuery, useUpdateMeUserMutation } from '@/redux/api/userApi';
import { selectCurrentToken } from '@/redux/authSlice';
import { useAppSelector } from '@/redux/store';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function ProfileFlow() {
  const token = useAppSelector(selectCurrentToken);
  const { data: meResponse } = useGetMeUserQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });
  const [updateMeUser, { isLoading: isSavingProfile }] = useUpdateMeUserMutation();

  const [screen, setScreen] = useState<ScreenKey>('menu');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Local state for UI responsiveness
  const [profile, setProfile] = useState<ProfileFormValues>({
    fullName: '',
    accountEmail: '',
    sex: 'Male',
    phoneNumber: '',
    location: '',
    profilePhotoUrl: null,
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

  // Sync local state when API data arrives
  useEffect(() => {
    const meData = meResponse?.data;
    console.log({ meData });
    if (meData) {
      setProfile({
        fullName: meData.fullName || '',
        accountEmail: meData.email || '',
        phoneNumber: meData.phoneNumber || '',
        sex: meData.gender || 'Male',
        location: meData.location || '',
        profilePhotoUrl: meData.profilePhoto || null,
      });
    }
  }, [meResponse]);

  useFocusEffect(
    useCallback(() => {
      setScreen('menu');
      return () => {
        isTransitioning.current = false;
      };
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  const handleHeaderBack = () => {
    if (isTransitioning.current) return;
    if (screen !== 'menu') {
      changeScreen('menu');
      return;
    }
    router.replace('/(tabs)');
  };

  /**
   * Handle the actual API submission
   * Receives FormData from the child component.
   * formData structure: { data: stringifiedJSON, file: File }
   */
  const handleProfileSave = async (formData: FormData) => {
    try {
      console.log({ formData });
      const response = await updateMeUser(formData).unwrap();

      toast.success(response?.message || 'Profile updated successfully!');

      // Navigate back to menu on success
      // The useEffect above will trigger a re-sync once RTK Query refetches
      changeScreen('menu');
    } catch (error: any) {
      console.log({ error });
      const message = error?.data?.message || 'Failed to update settings.';
      toast.error(message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.root}>
        {/* Header Section */}
        <View style={styles.header}>
          <Pressable
            onPress={handleHeaderBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <ChevronLeft size={20} color="#E8F0FF" />
          </Pressable>
          <Text style={styles.headerTitle}>{SCREEN_TITLES[screen]}</Text>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Animated Body Content */}
        <Animated.View
          style={[styles.animatedBody, { opacity, transform: [{ translateX: slideX }] }]}>
          {screen === 'menu' && (
            <MenuScreen
              fullName={profile.fullName}
              location={profile.location || ''}
              profilePhotoUrl={profile.profilePhotoUrl || undefined}
              onNavigate={changeScreen}
              onDeleteAccount={() => setDeleteModalVisible(true)}
              onLogout={handleLogout}
            />
          )}

          {screen === 'account-settings' && (
            <AccountSettingsScreen
              initialData={{
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber,
                gender: profile.sex as 'Male' | 'Female',
                profilePhotoUrl: profile.profilePhotoUrl || undefined,
                location: profile.location || '',
              }}
              onSave={handleProfileSave}
              isSaving={isSavingProfile}
            />
          )}

          {screen === 'change-password' && <ChangePasswordScreen />}
          {screen === 'help-support' && <HelpSupportScreen />}
          {screen === 'faqs' && <FaqsScreen onNavigate={changeScreen} />}
          {screen === 'privacy-policy' && <PrivacyPolicyScreen />}
          {screen === 'terms' && <TermsScreen />}
        </Animated.View>

        <DeleteAccountModal
          visible={deleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={() => {
            setDeleteModalVisible(false);
            router.replace('/(auth)/login');
          }}
        />
      </View>
    </SafeAreaView>
  );
}
