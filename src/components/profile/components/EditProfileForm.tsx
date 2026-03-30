import React, { useEffect, useState } from 'react';
import { TextInput, Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AdminSelectField } from '../../admin-dashboard/AdminSelectField';
import ProfilePhotoPicker from './ProfilePhotoPicker';
import { ProfileFormValues } from '../types';
import { styles } from '../styles';
import InputLabel from './InputLabel';
import PrimaryButton from './PrimaryButton';
import { toast } from 'sonner-native';

type EditProfileFormProps = {
  value: ProfileFormValues;
  onSave: (next: ProfileFormValues, profilePhoto?: File | null) => Promise<void> | void;
  saveLabel?: string;
};

export default function EditProfileForm({
  value,
  onSave,
  saveLabel = 'Save',
}: EditProfileFormProps) {
  const [draft, setDraft] = useState<ProfileFormValues>(value);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  // Gender options
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  // Date picker handler
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDraft((prev) => ({ ...prev, dateOfBirth: selectedDate.toISOString().split('T')[0] }));
    }
  };

  // Save handler
  const handleSave = async () => {
    try {
      console.log('Saving profile data:', draft);
      console.log('Profile photo:', profilePhoto);
      await onSave(draft, profilePhoto);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Update failed. Please try again.');
    }
  };

  return (
    <>
      {/* Profile Photo Picker */}
      <ProfilePhotoPicker
        photoUri={
          (profilePhoto &&
            (profilePhoto.uri || (typeof profilePhoto === 'string' ? profilePhoto : undefined))) ||
          draft.profilePhotoUrl ||
          undefined
        }
        onPick={setProfilePhoto}
      />

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
      <View>
        <TextInput
          value={draft.dateOfBirth}
          editable={false}
          placeholder="YYYY-MM-DD"
          style={styles.input}
          onTouchStart={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={draft.dateOfBirth ? new Date(draft.dateOfBirth) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </View>

      <InputLabel>Gender</InputLabel>
      <AdminSelectField
        value={draft.sex as any}
        options={genderOptions as any}
        onChange={(val: string) => setDraft((prev) => ({ ...prev, sex: val }))}
      />

      <InputLabel>Phone Number</InputLabel>
      <TextInput
        value={draft.phoneNumber}
        onChangeText={(text) => setDraft((prev) => ({ ...prev, phoneNumber: text }))}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <PrimaryButton title={saveLabel} onPress={handleSave} />
    </>
  );
}
