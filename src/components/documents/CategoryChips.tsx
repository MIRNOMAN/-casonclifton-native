import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { DocumentCategoryFilter, DOCUMENT_CATEGORIES } from '@/features/documents/documents-data';

type CategoryChipsProps = {
  value: DocumentCategoryFilter;
  onChange: (value: DocumentCategoryFilter) => void;
};

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {DOCUMENT_CATEGORIES.map((category) => {
        const active = value === category;

        return (
          <Pressable
            key={category}
            onPress={() => onChange(category)}
            style={[styles.chip, active && styles.activeChip]}>
            <Text style={[styles.label, active && styles.activeLabel]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 22,
    paddingRight: 12,
  },
  chip: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeChip: {
    backgroundColor: '#2E3B4F',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
