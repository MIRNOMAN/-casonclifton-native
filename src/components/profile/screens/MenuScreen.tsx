import { MENU_ITEMS } from '@/components/profile/data';
import { ScreenKey } from '@/components/profile/types';
import { BlurView } from 'expo-blur';
import { LogOut, Trash2, UserCircle2 } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MenuRow from '../components/MenuRow';
import { styles } from '../styles';

type MenuScreenProps = {
  fullName: string;
  onNavigate: (screen: ScreenKey) => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
};

export default function MenuScreen({
  fullName,
  onNavigate,
  onDeleteAccount,
  onLogout,
}: MenuScreenProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileCard}>
        <BlurView
          intensity={42}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.avatarOuter}>
          <Image
            source={require('../../../../assets/images/avatar/avatar.jpg')}
            style={styles.avatarImage}
          />
        </View>
        <Text style={styles.profileName}>{fullName}</Text>
        <Text style={styles.profileLocation}>Dubai, UAE</Text>
      </View>

      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.menuGroup}>
        {MENU_ITEMS.map((item) => (
          <MenuRow key={item.key} item={item} onPress={() => onNavigate(item.key)} />
        ))}
      </View>

      <Pressable
        onPress={onDeleteAccount}
        style={({ pressed }) => [styles.dangerRow, pressed && styles.buttonPressed]}>
        <BlurView
          intensity={40}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Trash2 size={16} color="#F87171" />
        <Text style={styles.dangerText}>Delete Account</Text>
      </Pressable>

      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}>
        <BlurView
          intensity={40}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <LogOut size={16} color="#FE7E79" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}
