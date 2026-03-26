import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { ProfileFormValues } from '../types';
import { styles } from '../styles';
import InputLabel from './InputLabel';
import PrimaryButton from './PrimaryButton';

type EditProfileFormProps = {
  value: ProfileFormValues;
  onSave: (next: ProfileFormValues) => Promise<void> | void;
  saveLabel?: string;
};

export default function EditProfileForm({
  value,
  onSave,
  saveLabel = 'Save',
}: EditProfileFormProps) {
  const [draft, setDraft] = useState<ProfileFormValues>(value);

  const handleDateOfBirthChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 8);

    if (digitsOnly.length <= 4) {
      setDraft((prev) => ({ ...prev, dateOfBirth: digitsOnly }));
      return;
    }

    if (digitsOnly.length <= 6) {
      setDraft((prev) => ({
        ...prev,
        dateOfBirth: `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`,
      }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      dateOfBirth: `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6)}`,
    }));
  };

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

      <InputLabel>Location</InputLabel>
      <TextInput
        value={draft.location}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, location: text }))}
        style={styles.input}
      />

      <InputLabel>Date of Birth</InputLabel>
      <TextInput
        value={draft.dateOfBirth}
        onChangeText={handleDateOfBirthChange}
        keyboardType="number-pad"
        maxLength={10}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#7284A3"
        style={styles.input}
      />

      <InputLabel>Gender</InputLabel>
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

      <PrimaryButton title={saveLabel} onPress={() => onSave(draft)} />
    </>
  );
}
