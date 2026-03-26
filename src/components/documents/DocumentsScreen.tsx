import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryChips } from './CategoryChips';
import { DocumentCard } from './DocumentCard';
import { DocumentSearchBar } from './DocumentSearchBar';
import { HomeHeader } from './HomeHeader';
import { useDocuments } from '@/features/documents/documents-context';
import { DocumentCategoryFilter, DocumentItem } from '@/features/documents/documents-data';

type DocumentsScreenProps = {
  mode: 'home' | 'favorite';
  userRole?: 'admin' | 'user';
  headerVariant?: 'default' | 'admin';
};

export function DocumentsScreen({
  mode,
  userRole = 'user',
  headerVariant = 'default',
}: DocumentsScreenProps) {
  const insets = useSafeAreaInsets();
  const { documents, toggleFavorite } = useDocuments();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocumentCategoryFilter>('All');

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesFavorite = mode === 'favorite' ? document.isFavorite : true;
      const matchesCategory = category === 'All' ? true : document.category === category;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        document.title.toLowerCase().includes(query) ||
        document.category.toLowerCase().includes(query);

      return matchesFavorite && matchesCategory && matchesSearch;
    });
  }, [category, documents, mode, search]);

  const renderDocument = ({ item }: { item: DocumentItem }) => (
    <DocumentCard
      document={item}
      onPress={() =>
        router.push({
          pathname: '/document/[id]',
          params: { id: item.id },
        })
      }
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredDocuments}
        keyExtractor={(item) => item.id}
        renderItem={renderDocument}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <HomeHeader userRole={userRole} variant={headerVariant} />
            <DocumentSearchBar value={search} onChangeText={setSearch} />
            <CategoryChips value={category} onChange={setCategory} />
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>
              {mode === 'favorite' ? 'No favorites yet' : 'No documents found'}
            </Text>
            <Text style={styles.emptyBody}>
              {mode === 'favorite'
                ? 'Tap the star on any card to add it to Favorite.'
                : 'Try a different category or search term.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000E26',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyBody: {
    color: '#9BA5B5',
    fontSize: 14,
    textAlign: 'center',
  },
});
