import { HomeHeader } from '@/components/documents/HomeHeader';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNdaOverviewCard, NDA_TEXT } from './AdminNdaOverviewCard';

export function AdminNdaViewScreen() {
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

        <AdminNdaOverviewCard onOpen={() => {}} onEdit={() => router.push('/admin/nda-edit')} />

        <Text style={styles.hiddenText}>{NDA_TEXT}</Text>
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
  hiddenText: {
    height: 0,
    opacity: 0,
  },
});
