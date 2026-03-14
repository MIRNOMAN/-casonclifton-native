import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from '../styles';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
      <BlurView
        intensity={42}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}
