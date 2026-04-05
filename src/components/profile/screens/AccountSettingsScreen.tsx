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
  Animated,
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
  isLoading?: boolean; // NEW: skeleton prop
};

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

// ─── Skeleton Components ───────────────────────────────────────────────────

function SkeletonBox({ width, height, borderRadius = 8, style }: any) {
  const opacity = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E3E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
}

function AccountSettingsSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Avatar skeleton */}
        <View style={styles.avatarWrapper}>
          <SkeletonBox width={100} height={100} borderRadius={50} />
          <SkeletonBox width={80} height={12} borderRadius={6} style={{ marginTop: 10 }} />
        </View>

        {/* Input skeletons */}
        {['Full Name', 'Phone Number', 'Location', 'Gender'].map((label) => (
          <View key={label} style={styles.inputGroup}>
            <SkeletonBox width={80} height={12} borderRadius={6} style={{ marginBottom: 8 }} />
            <SkeletonBox width="100%" height={46} borderRadius={8} />
          </View>
        ))}

        {/* Button skeleton */}
        <SkeletonBox width="100%" height={50} borderRadius={8} style={{ marginTop: 10 }} />
      </View>
    </ScrollView>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function AccountSettingsScreen({
  initialData,
  onSave,
  isSaving = false,
  isLoading = false,
}: AccountSettingsScreenProps) {
  const [form, setForm] = useState<AccountSettingsData>(initialData);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);

  // Show skeleton while data is loading
  if (isLoading) {
    return <AccountSettingsSkeleton />;
  }

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

    // Append JSON text fields
    const jsonData = {
      fullName: form.fullName,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      location: form.location,
    };
    formData.append('data', JSON.stringify(jsonData));

    // ✅ FIX: field name must be 'profilePhoto' to match the API
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto as any);
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
              <Text style={{ color: '#7284A3', fontSize: 13 }}>Upload</Text>
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
    color: '#1a1a2e',
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