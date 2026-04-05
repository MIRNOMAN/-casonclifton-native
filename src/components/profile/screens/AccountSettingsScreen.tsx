import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

type AccountSettingsData = {
  fullName: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  profilePhotoUrl?: string | null;
  location: string;
};
type AccountSettingsScreenProps = {
  initialData: AccountSettingsData;
  onSave: (formData: FormData) => Promise<void>;
  isSaving?: boolean;
};

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

export default function AccountSettingsScreen({
  initialData,
  onSave,
  isSaving = false,
}: AccountSettingsScreenProps) {
  const [form, setForm] = useState<AccountSettingsData>(initialData);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      toast.error('Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      legacy: true,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const photoFile = {
      uri: asset.uri,
      name: asset.fileName || `profile_${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    };

    setProfilePhoto(photoFile);
    setSelectedImagePreview(asset.uri);
    setForm((prev) => ({ ...prev, profilePhotoUrl: asset.uri }));
  };

  const previewUri = selectedImagePreview || form.profilePhotoUrl || undefined;

  const handleSave = async () => {
    const formData = new FormData();

    // 1. Create the JSON object for the "data" field
    const jsonData = {
      fullName: form.fullName,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      location: form.location,
    };

    // 2. Append text data as a stringified JSON field
    formData.append('data', JSON.stringify(jsonData));

    // 3. Append the file separately at the top level
    if (profilePhoto) {
      formData.append('file', profilePhoto as any);
    }

    await onSave(formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text>Upload</Text>
            </View>
          )}
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={form.fullName}
            onChangeText={(text) => setForm((prev) => ({ ...prev, fullName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={form.phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(text) => setForm((prev) => ({ ...prev, phoneNumber: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={form.location}
            onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity onPress={() => setShowGenderModal(true)}>
            <View pointerEvents="none">
              <TextInput style={styles.input} value={form.gender} editable={false} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={showGenderModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalContent}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setForm((p) => ({ ...p, gender: opt.value as any }));
                  setShowGenderModal(false);
                }}
                style={styles.genderOption}>
                <Text>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400 },
  avatarWrapper: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: { color: '#7284A3', marginTop: 8 },
  inputGroup: { marginBottom: 15 },
  label: { color: '#7284A3', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#E3E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFF',
  },
  saveButton: {
    backgroundColor: '#7284A3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 250 },
  genderOption: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
});
