import React from 'react';
import { StyleSheet, View } from 'react-native';

type HomeHeaderSkeletonProps = {
  variant?: 'default' | 'admin';
};

export function HomeHeaderSkeleton({ variant = 'default' }: HomeHeaderSkeletonProps) {
  if (variant === 'admin') {
    return (
      <View style={styles.adminHeaderRow}>
        <View style={styles.backButtonPlaceholder} />
        <View style={styles.adminTitlePlaceholder} />
        <View style={styles.adminSpacer} />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.profileRow}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <View style={styles.namePlaceholder} />
          <View style={styles.emailPlaceholder} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1D2A40',
  },
  namePlaceholder: {
    width: 140,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1D2A40',
    marginBottom: 8,
  },
  emailPlaceholder: {
    width: 180,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#1D2A40',
  },
  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    minHeight: 32,
  },
  backButtonPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D2A40',
  },
  adminTitlePlaceholder: {
    width: 150,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1D2A40',
  },
  adminSpacer: {
    width: 32,
    height: 32,
  },
});
