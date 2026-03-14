import { CalendarDays, FileText, Pencil, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AdminDocument } from './types';

type AdminDocumentCardProps = {
  document: AdminDocument;
  onOpen: (document: AdminDocument) => void;
  onEdit: (document: AdminDocument) => void;
  onDelete: (document: AdminDocument) => void;
};

export function AdminDocumentCard({ document, onOpen, onEdit, onDelete }: AdminDocumentCardProps) {
  return (
    <Pressable
      onPress={() => onOpen(document)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <FileText size={18} color="#12D7CC" />
        </View>

        <View style={styles.actionRow}>
          <Pressable
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onEdit(document);
            }}>
            <Pencil size={18} color="#FFFFFF" />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onDelete(document);
            }}>
            <Trash2 size={18} color="#F43F5E" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.category}>{document.category}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <CalendarDays size={14} color="#9BA5B5" />
          <Text style={styles.metaText}>{document.effectiveDate}</Text>
        </View>
        <Text style={styles.metaText}>{document.pages} pages</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2538',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.95,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#11323A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  category: {
    color: '#A7B3C8',
    fontSize: 16,
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
    fontSize: 14,
  },
});
