import { BlurView } from 'expo-blur';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../styles';

export type StatusModalType = 'success' | 'error';

export type StatusModalProps = {
  visible: boolean;
  type: StatusModalType;
  title: string;
  subtitle?: string;
  onClose: () => void;
};

export default function StatusModal({ visible, type, title, subtitle, onClose }: StatusModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <BlurView
            intensity={52}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.modalIconWrap}>
            {type === 'success' ? (
              <CheckCircle2 size={20} color="#22C55E" />
            ) : (
              <XCircle size={20} color="#EF4444" />
            )}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.modalSubtitle}>{subtitle}</Text>}
          <View style={styles.modalActions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.modalCancel, pressed && styles.buttonPressed]}>
              <BlurView
                intensity={40}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView"
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Text style={styles.modalCancelText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
