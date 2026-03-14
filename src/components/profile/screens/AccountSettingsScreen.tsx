import { ProfileFormValues } from '@/components/profile/types';
import { UserCircle2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import EditProfileForm from '../components/EditProfileForm';
import { styles } from '../styles';

type AccountSettingsScreenProps = {
  profile: ProfileFormValues;
  onSave: (next: ProfileFormValues) => void;
};

export default function AccountSettingsScreen({ profile, onSave }: AccountSettingsScreenProps) {
  const handleSave = (next: ProfileFormValues) => {
    if (!next.fullName || !next.accountEmail || !next.phoneNumber) {
      Alert.alert('Missing details', 'Please complete required account information.');
      return;
    }

    onSave(next);
    Alert.alert('Saved', 'Account settings updated successfully.');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
      <View style={styles.profileCardCompact}>
        <View style={styles.avatarOuter}>
          <UserCircle2 size={38} color="#FFFFFF" />
        </View>
        <Text style={styles.profileName}>{profile.fullName}</Text>
        <Text style={styles.profileLocation}>Dubai, UAE</Text>
      </View>

      <EditProfileForm value={profile} onSave={handleSave} />
    </ScrollView>
  );
}
