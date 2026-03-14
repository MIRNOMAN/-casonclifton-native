import React, { useState } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';
import InputLabel from '../components/InputLabel';
import PrimaryButton from '../components/PrimaryButton';
import { styles } from '../styles';

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitPassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Weak password', 'New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Confirm password does not match.');
      return;
    }

    Alert.alert('Updated', 'Your password has been updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
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

      <PrimaryButton title="Update Password" onPress={submitPassword} />
    </ScrollView>
  );
}
