import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProfilePhotoPickerProps {
  photoUri?: string | null;
  onPick: (file: any) => void;
}

export default function ProfilePhotoPicker({ photoUri, onPick }: ProfilePhotoPickerProps) {
  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      onPick({
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: asset.type || 'image/jpeg',
      });
    }
  };

  return (
    <TouchableOpacity onPress={handlePick} style={{ alignItems: 'center', marginBottom: 16 }}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      ) : (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#eee',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Upload Photo</Text>
        </View>
      )}
      <Text style={{ color: '#7284A3', marginTop: 8 }}>Change Photo</Text>
    </TouchableOpacity>
  );
}
