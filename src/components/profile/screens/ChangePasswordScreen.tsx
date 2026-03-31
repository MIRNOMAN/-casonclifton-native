import React, { useState } from 'react';
import {  ScrollView, TextInput } from 'react-native';
import InputLabel from '../components/InputLabel';
import PrimaryButton from '../components/PrimaryButton';
import { styles } from '../styles';
import StatusModal, { StatusModalType } from '../components/StatusModal';
import { useUpdateChangePasswordMutation } from '@/redux/api/userApi';

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<StatusModalType>('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [updateChangePassword, { isLoading }] = useUpdateChangePasswordMutation();

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const submitPassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setModalType('error');
      setModalTitle('Missing fields');
      setModalSubtitle('Please fill all password fields.');
      setModalVisible(true);
      return;
    }
    if (newPassword.length < 8) {
      setModalType('error');
      setModalTitle('Weak password');
      setModalSubtitle('New password must be at least 8 characters.');
      setModalVisible(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalType('error');
      setModalTitle('Mismatch');
      setModalSubtitle('Confirm password does not match.');
      setModalVisible(true);
      return;
    }

    try {
      await updateChangePassword({ oldPassword, newPassword, confirmPassword }).unwrap();
      setModalType('success');
      setModalTitle('Updated');
      setModalSubtitle('Your password has been updated successfully.');
      setModalVisible(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setModalType('error');
      setModalTitle('Error');
      setModalSubtitle(error?.data?.message || 'Failed to update password.');
      setModalVisible(true);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
        <InputLabel>Old Password</InputLabel>
        <TextInput
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Enter Password"
          placeholderTextColor="#6E7D98"
          style={styles.input}
        />

        <InputLabel>New Password</InputLabel>
        <TextInput
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter Password"
          placeholderTextColor="#6E7D98"
          style={styles.input}
        />

        <InputLabel>Confirm New Password</InputLabel>
        <TextInput
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Enter Password"
          placeholderTextColor="#6E7D98"
          style={styles.input}
        />

        <PrimaryButton
          title={isLoading ? 'Updating...' : 'Update Password'}
          onPress={submitPassword}
        />
      </ScrollView>
      <StatusModal
        visible={modalVisible}
        type={modalType}
        title={modalTitle}
        subtitle={modalSubtitle}
        onClose={handleModalClose}
      />
    </>
  );
}
