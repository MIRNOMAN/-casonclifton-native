import { Pencil } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AdminNdaOverviewCardProps = {
  onOpen: () => void;
  onEdit: () => void;
};

export const NDA_TEXT = `This Non-Disclosure Agreement ("Agreement") is entered into by and between Creston Industries ("Company") and the undersigned individual ("Recipient").\n\nThe Recipient agrees to hold in confidence and not disclose any confidential information, documents, procedures, or materials accessed through the Creston Document Management System.\n\nViolation of this agreement may result in legal action and immediate termination of access privileges.\n\nThis agreement is effective upon acceptance and remains in force for 2 years following termination of access.`;

export function AdminNdaOverviewCard({ onOpen, onEdit }: AdminNdaOverviewCardProps) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>NDA Agreement</Text>
          <Text style={styles.updated}>Last updated: March 10, 2024</Text>
        </View>

        <Pressable
          style={styles.editButton}
          onPress={(event) => {
            event.stopPropagation();
            onEdit();
          }}>
          <Pencil size={14} color="#8FA0BE" />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Text numberOfLines={10} style={styles.previewText}>
        {NDA_TEXT}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111E34',
    borderRadius: 16,
    padding: 16,
  },
  cardPressed: {
    opacity: 0.95,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  updated: {
    color: '#A2AEC4',
    fontSize: 16,
  },
  editButton: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#30415E',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editText: {
    color: '#8FA0BE',
    fontSize: 16,
    fontWeight: '600',
  },
  previewText: {
    color: '#CCD4E3',
    fontSize: 17,
    lineHeight: 32,
  },
});
