import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';
import { COLORS } from '@/constants/colors';

type AccountSettingsData = {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  profilePhotoUrl?: string | null;
  location: string;
};

const mediaTypes = ImagePicker.MediaTypeOptions.All;

type AccountSettingsScreenProps = {
  initialData: AccountSettingsData;
  onSave: (
    data: AccountSettingsData,
    profilePhoto?: { uri: string; name: string; type: string } | null
  ) => Promise<void>;
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
  const [profilePhoto, setProfilePhoto] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handlePickImage = async () => {
    const mediaTypes = ImagePicker.MediaTypeOptions.Images;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      let uri = asset.uri;
      if (!uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }
      console.log('Selected image URI:', uri);
      // Avoid assigning to read-only property
      setProfilePhoto({
        uri,
        name: asset.fileName ? asset.fileName : 'photo.jpg',
        type: asset.type ? asset.type : 'image/jpeg',
      });
      setForm((prev) => ({ ...prev, profilePhotoUrl: uri }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm((prev) => ({ ...prev, dateOfBirth: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const handleGenderSelect = (gender: 'Male' | 'Female') => {
    setForm((prev) => ({ ...prev, gender }));
    setShowGenderModal(false);
  };

  const handleSave = async () => {
    if (
      !form.fullName ||
      !form.location ||
      !form.phoneNumber ||
      !form.dateOfBirth ||
      !form.gender
    ) {
      toast.error('Please fill all required fields.');
      return;
    }
    await onSave(form, profilePhoto);
  };

  return (
    <ScrollView contentContainerStyle={stylesContainer.container}>
      <View style={stylesContainer.card}>
        <TouchableOpacity onPress={handlePickImage} style={stylesContainer.avatarWrapper}>
          {form.profilePhotoUrl ? (
            <Image source={{ uri: form.profilePhotoUrl }} style={stylesContainer.avatar} />
          ) : (
            <View style={stylesContainer.avatarPlaceholder}>
              <Text style={{ color: '#7284A3' }}>Upload Photo</Text>
            </View>
          )}
          <Text style={stylesContainer.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <View style={stylesContainer.inputGroup}>
          <Text style={stylesContainer.label}>Full Name</Text>
          <TextInput
            style={stylesContainer.input}
            value={form.fullName}
            onChangeText={(text) => setForm((prev) => ({ ...prev, fullName: text }))}
            placeholder="Enter your name"
          />
        </View>

        <View style={stylesContainer.inputGroup}>
          <Text style={stylesContainer.label}>Phone Number</Text>
          <TextInput
            style={stylesContainer.input}
            value={form.phoneNumber}
            onChangeText={(text) => setForm((prev) => ({ ...prev, phoneNumber: text }))}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
        <View style={stylesContainer.inputGroup}>
          <Text style={stylesContainer.label}>Location</Text>
          <TextInput
            style={stylesContainer.input}
            value={form.location}
            onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
            placeholder="Enter location"
          />
        </View>

        <View style={stylesContainer.inputGroup}>
          <Text style={stylesContainer.label}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={stylesContainer.input}
              value={form.dateOfBirth}
              editable={false}
              placeholder="YYYY-MM-DD"
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        <View style={stylesContainer.inputGroup}>
          <Text style={stylesContainer.label}>Gender</Text>
          <TouchableOpacity onPress={() => setShowGenderModal(true)}>
            <TextInput
              style={stylesContainer.input}
              value={form.gender}
              editable={false}
              placeholder="Select gender"
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[stylesContainer.saveButton, isSaving && { backgroundColor: '#b0b0b0' }]}
          onPress={handleSave}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={stylesContainer.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Gender Select Modal */}
      <Modal visible={showGenderModal} transparent animationType="fade">
        <TouchableOpacity
          style={stylesContainer.modalOverlay}
          onPress={() => setShowGenderModal(false)}>
          <View style={stylesContainer.modalContent}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleGenderSelect(option.value as 'Male' | 'Female')}
                style={stylesContainer.genderOption}>
                <Text style={stylesContainer.genderText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const stylesContainer = StyleSheet.create({
  container: {
    flexGrow: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,

    marginTop: 32,
    marginBottom: 32,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    color: '#7284A3',
    marginTop: 8,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#7284A3',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E3E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8FAFF',
    color: '#222',
  },
  saveButton: {
    backgroundColor: '#7284A3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  genderOption: {
    paddingVertical: 12,
    width: 120,
    alignItems: 'center',
  },
  genderText: {
    fontSize: 16,
    color: '#222',
  },
});
