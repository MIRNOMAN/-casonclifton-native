import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { ProfileFormValues } from '../types';
import { styles } from '../styles';
import InputLabel from './InputLabel';
import PrimaryButton from './PrimaryButton';

type EditProfileFormProps = {
  value: ProfileFormValues;
  onSave: (next: ProfileFormValues) => void;
};

export default function EditProfileForm({ value, onSave }: EditProfileFormProps) {
  const [draft, setDraft] = useState<ProfileFormValues>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <>
      <InputLabel>Full Name</InputLabel>
      <TextInput
        value={draft.fullName}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, fullName: text }))}
        style={styles.input}
      />

      <InputLabel>Email</InputLabel>
      <TextInput
        value={draft.accountEmail}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, accountEmail: text }))}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <InputLabel>Date of Birth</InputLabel>
      <TextInput
        value={draft.dateOfBirth}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, dateOfBirth: text }))}
        style={styles.input}
      />

      <InputLabel>Sex</InputLabel>
      <TextInput
        value={draft.sex}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, sex: text }))}
        style={styles.input}
      />

      <InputLabel>Phone Number</InputLabel>
      <TextInput
        value={draft.phoneNumber}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, phoneNumber: text }))}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <PrimaryButton title="Save" onPress={() => onSave(draft)} />
    </>
  );
}
