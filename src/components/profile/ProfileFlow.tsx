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
  const [profile, setProfile] = useState<ProfileFormValues>({
    fullName: 'Ahmed Hassan',
    accountEmail: 'superproglobaldubai@yastor.glog',
    dateOfBirth: '1989-06-12',
    sex: 'Male',
    phoneNumber: '97123456789030',
    location: 'Dubai, UAE',
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

  useEffect(() => {
    slideX.setValue(0);
    opacity.setValue(1);
  }, [opacity, slideX]);

  useEffect(() => {
    const meData = meResponse?.data;

    if (!meData) {
      return;
    }

    setProfile((prev) => ({
      ...prev,
      fullName: meData.fullName?.trim() || prev.fullName,
      accountEmail: meData.email?.trim() || prev.accountEmail,
      phoneNumber: meData.phoneNumber?.trim() || prev.phoneNumber,
      dateOfBirth: meData.dateOfBirth?.trim() || prev.dateOfBirth,
      sex: meData.gender?.trim() || prev.sex,
      location: meData.location?.trim() || prev.location,
      profilePhotoUrl: meData.profilePhoto || null,
    }));
  }, [meResponse]);

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

  const handleProfileSave = async (
    next: ProfileFormValues,
    profilePhoto?: { uri: string; name: string; type: string } | null
  ) => {
    try {
      const response = await updateMeUser({
        data: {
          fullName: next.fullName,
          email: next.accountEmail,
          phoneNumber: next.phoneNumber,
          dateOfBirth: next.dateOfBirth,
          gender: next.sex,
          location: next.location,
        },
        profilePhoto: profilePhoto
          ? new File([await (await fetch(profilePhoto.uri)).blob()], profilePhoto.name, {
              type: profilePhoto.type,
            })
          : undefined,
      }).unwrap();
      setProfile(next);
      toast.success(response?.message || 'Account settings updated successfully!');
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error ||
        'Failed to update account settings. Please try again.';
      toast.error(message);
    }
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
              location={profile.location || ''}
              profilePhotoUrl={profile.profilePhotoUrl || undefined}
              onNavigate={changeScreen}
              onDeleteAccount={() => setDeleteModalVisible(true)}
              onLogout={handleLogout}
            />
          ) : null}

          {screen === 'change-password' ? <ChangePasswordScreen /> : null}
          {screen === 'help-support' ? <HelpSupportScreen /> : null}
          {screen === 'faqs' ? <FaqsScreen onNavigate={changeScreen} /> : null}
          {screen === 'account-settings' ? (
            <AccountSettingsScreen
              initialData={{
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber,
                dateOfBirth: profile.dateOfBirth,
                gender: profile.sex as 'Male' | 'Female',
                profilePhotoUrl: profile.profilePhotoUrl || undefined,
                location: profile.location || '',
              }}
              onSave={async (data, profilePhoto) => {
                // Map AccountSettingsData back to ProfileFormValues
                const nextProfile: ProfileFormValues = {
                  ...profile,
                  fullName: data.fullName,
                  phoneNumber: data.phoneNumber,
                  dateOfBirth: data.dateOfBirth,
                  sex: data.gender,
                  profilePhotoUrl: data.profilePhotoUrl || null,
                  location: data.location || '',
                };
                // Pass the actual profilePhoto object to handleProfileSave
                await handleProfileSave(nextProfile, profilePhoto as any);
              }}
              isSaving={isSavingProfile}
            />
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
