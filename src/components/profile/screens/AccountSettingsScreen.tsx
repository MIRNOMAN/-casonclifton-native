import { ProfileFormValues } from '@/components/profile/types';
import { UserCircle2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import EditProfileForm from '../components/EditProfileForm';
import { styles } from '../styles';

type AccountSettingsScreenProps = {
  profile: ProfileFormValues;
  onSave: (next: ProfileFormValues) => Promise<void>;
  isSaving?: boolean;
};

export default function AccountSettingsScreen({
  profile,
  onSave,
  isSaving = false,
}: AccountSettingsScreenProps) {
  const handleSave = async (next: ProfileFormValues) => {
    if (!next.fullName || !next.location || !next.phoneNumber) {
      Alert.alert('Missing details', 'Please complete required account information.');
      return;
    }

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(next.dateOfBirth);
    if (!isValidDate) {
      Alert.alert('Invalid date', 'Date of Birth must be in YYYY-MM-DD format.');
      return;
    }

    await onSave(next);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
      <View style={styles.profileCardCompact}>
        <View style={styles.avatarOuter}>
          {profile.profilePhotoUrl ? (
            <Image source={{ uri: profile.profilePhotoUrl }} style={styles.avatarImage} />
          ) : (
            <UserCircle2 size={38} color="#FFFFFF" />
          )}
        </View>
        <Text style={styles.profileName}>{profile.fullName}</Text>
        <Text style={styles.profileLocation}>Dubai, UAE</Text>
      </View>

      <EditProfileForm
        value={profile}
        onSave={handleSave}
        saveLabel={isSaving ? 'Saving...' : 'Save'}
      />
    </ScrollView>
  );
}
