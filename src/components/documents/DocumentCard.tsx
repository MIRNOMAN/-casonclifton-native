import { Clock3, FileText, Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DocumentItem } from '@/features/documents/documents-data';

type DocumentCardProps = {
  document: DocumentItem;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export function DocumentCard({ document, onPress, onToggleFavorite }: DocumentCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <FileText size={20} color="#12D7CC" />
        </View>
        <Pressable hitSlop={8} onPress={onToggleFavorite}>
          <Star size={20} color="#F3C422" fill={document.isFavorite ? '#F3C422' : 'transparent'} />
        </Pressable>
      </View>

      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.category}>{document.category}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Clock3 size={14} color="#9BA5B5" />
          <Text style={styles.metaText}>{document.updatedAt}</Text>
        </View>
        <Text style={styles.metaText}>{document.pages} pages</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2538',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.92,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#11323A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  category: {
    color: '#9BA5B5',
    fontSize: 14,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#9BA5B5',
    fontSize: 13,
  },
});
