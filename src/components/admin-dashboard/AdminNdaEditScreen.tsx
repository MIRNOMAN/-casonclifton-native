import { HomeHeader } from '@/components/documents/HomeHeader';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NDA_TEXT } from './AdminNdaOverviewCard';

export function AdminNdaEditScreen() {
  const [value, setValue] = useState(NDA_TEXT);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <HomeHeader variant="admin" userRole="admin" />

        <View style={styles.tabRow}>
          <Pressable style={styles.tabChip}>
            <Text style={styles.tabText}>Documents</Text>
          </Pressable>
          <Pressable style={[styles.tabChip, styles.tabChipActive]}>
            <ShieldCheck size={14} color="#12D7CC" />
            <Text style={[styles.tabText, styles.tabTextActive]}>NDA</Text>
          </Pressable>
        </View>

        <View style={styles.editorWrap}>
          <TextInput
            value={value}
            onChangeText={setValue}
            multiline
            textAlignVertical="top"
            style={styles.editorInput}
          />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={() => router.back()}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000E26',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tabChip: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#142038',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tabChipActive: {
    backgroundColor: '#11313B',
  },
  tabText: {
    color: '#9CA8BE',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#12D7CC',
  },
  editorWrap: {
    flex: 1,
    backgroundColor: '#111E34',
    borderRadius: 16,
    padding: 14,
  },
  editorInput: {
    color: '#E3E8F1',
    fontSize: 18,
    lineHeight: 34,
    flex: 1,
  },
  actions: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#41516D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#A8B3C7',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
});
