import { MenuItem } from '@/components/profile/types';
import { BlurView } from 'expo-blur';
import {
  AlertCircle,
  ChevronRight,
  CircleHelp,
  Lock,
  Shield,
  UserCircle2,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../styles';

function getMenuIcon(key: MenuItem['key']) {
  if (key === 'change-password') return <Lock size={16} color="#C6D0E1" />;
  if (key === 'help-support') return <CircleHelp size={16} color="#C6D0E1" />;
  if (key === 'faqs') return <AlertCircle size={16} color="#C6D0E1" />;
  if (key === 'account-settings') return <UserCircle2 size={16} color="#C6D0E1" />;
  return <Shield size={16} color="#C6D0E1" />;
}

type MenuRowProps = {
  item: MenuItem;
  onPress: () => void;
};

export default function MenuRow({ item, onPress }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.rowCard, pressed && styles.rowPressed]}>
      <BlurView
        intensity={38}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.rowIcon}>{getMenuIcon(item.key)}</View>
      <Text style={styles.rowLabel}>{item.label}</Text>
      <ChevronRight size={16} color="#7B8AA4" style={styles.rowArrow} />
    </Pressable>
  );
}
