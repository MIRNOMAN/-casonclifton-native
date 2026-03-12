import { Search, SlidersHorizontal } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type DocumentSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function DocumentSearchBar({ value, onChangeText }: DocumentSearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={18} color="#6F7A8C" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        placeholderTextColor="#6F7A8C"
        style={styles.input}
      />
      <View style={styles.divider} />
      <SlidersHorizontal size={18} color="#A6B0C0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 46,
    borderRadius: 23,
    backgroundColor: '#182338',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#667085',
    marginHorizontal: 12,
  },
});
