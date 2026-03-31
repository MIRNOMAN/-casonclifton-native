import { BlurView } from 'expo-blur';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { styles as profileStyles } from '../styles';
import { useDeleteAccountMutation } from '@/redux/api/settings';

type DeleteAccountModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountModal({
  visible,
  onCancel,
  onConfirm,
}: DeleteAccountModalProps) {
  const [deleteAccount, { isLoading, isSuccess, isError, error }] = useDeleteAccountMutation();

  const handleDelete = async () => {
    try {
      await deleteAccount({}).unwrap();
      // Show success modal or navigate away
    } catch (err) {
      // Show error modal or message
    }
  };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={profileStyles.modalBackdrop}>
        <View style={profileStyles.modalCard}>
          <BlurView
            intensity={52}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={profileStyles.modalIconWrap}>
            <Trash2 size={16} color="#FFFFFF" />
          </View>
          <Text style={profileStyles.modalTitle}>Are You Sure?</Text>
          <Text style={profileStyles.modalSubtitle}>Do you want to delete your account?</Text>
          <View style={profileStyles.modalActions}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                profileStyles.modalCancel,
                pressed && profileStyles.buttonPressed,
              ]}>
              <BlurView
                intensity={40}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView"
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Text style={profileStyles.modalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                profileStyles.modalDelete,
                pressed && profileStyles.buttonPressed,
              ]}>
              <Text style={profileStyles.modalDeleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
