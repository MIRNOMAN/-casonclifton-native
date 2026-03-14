import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type AdminDeleteModalProps = {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminDeleteModal({ visible, title, onCancel, onConfirm }: AdminDeleteModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Delete Document?</Text>
          <Text style={styles.message}>"{title}" will be permanently removed.</Text>

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#01091BCC',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  container: {
    backgroundColor: '#060F24',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2A44',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  message: {
    color: '#BAC4D3',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#41516D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#A8B3C7',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
