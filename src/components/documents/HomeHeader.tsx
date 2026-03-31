import { router } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HomeHeaderSkeleton } from '@/components/skeleton/HomeHeaderSkeleton';
import { useGetMeUserQuery } from '@/redux/api/userApi';
import { selectCurrentRole, selectCurrentToken } from '@/redux/authSlice';
import { useAppSelector } from '@/redux/store';

const avatarImage = require('../../../assets/images/avatar/avatar.jpg');

type UserRole = 'admin' | 'user';

type HomeHeaderProps = {
  userRole?: UserRole;
  variant?: 'default' | 'admin';
};

export function HomeHeader({
  userRole = 'user',
  variant = 'default',
}: HomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentRole = useAppSelector(selectCurrentRole);
  const token = useAppSelector(selectCurrentToken);

  const { data, isLoading, isFetching } = useGetMeUserQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const shouldShowDashboard = currentRole === 'SUPERADMIN';

  const fullName = data?.data?.fullName?.trim() || 'User';
  const email = data?.data?.email || 'No email';
  const profilePhoto = data?.data?.profilePhoto || null;

  const profileImageSource = profilePhoto
    ? { uri: profilePhoto }
    : avatarImage;

  const handleDashboardPress = () => {
    setIsMenuOpen(false);
    router.push('/admin-dashboard');
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
  };

  // Admin Header
  if (variant === 'admin') {
    return (
      <View style={styles.adminHeaderRow}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.adminTitle}>Admin Dashboard</Text>

        <View style={styles.adminSpacer} />
      </View>
    );
  }

  // Skeleton Loading
  if ((isLoading || isFetching) && !data && !!token) {
    return <HomeHeaderSkeleton variant={variant} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.row}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrap}>
            <Pressable
              style={styles.avatar}
              onPress={() => setIsMenuOpen((prev) => !prev)}
            >
              <Image source={profileImageSource} style={styles.avatarImage} />
            </Pressable>

            {isMenuOpen && (
              <View style={styles.dropdownMenu}>
                {shouldShowDashboard && (
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={handleDashboardPress}
                  >
                    <Text style={styles.dropdownItemText}>
                      Dashboard
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View>
            <Text style={styles.greeting}>
              Hi, {fullName}!
            </Text>

            <View style={styles.locationRow}>
              <Mail size={12} color="#FFFFFF" />
              <Text style={styles.location}>{email}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    marginBottom: 22,
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    minHeight: 32,
  },

  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  adminTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 32,
  },

  adminSpacer: {
    width: 32,
    height: 32,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatarWrap: {
    position: 'relative',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF22',
  },

  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  location: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    minWidth: 140,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 20,
  },

  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  dropdownItemText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
});