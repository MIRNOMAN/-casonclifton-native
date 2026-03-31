import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryChips } from './CategoryChips';
import { DocumentCard } from './DocumentCard';
import { DocumentSearchBar } from './DocumentSearchBar';
import { HomeHeader } from './HomeHeader';
import { useGetAllDocumentsQuery } from '@/redux/api/documentsApi';
import { DocumentCategoryFilter } from '@/features/documents/documents-data';
import {
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation,
  useGetAllfavouritesQuery,
} from '@/redux/api/favourite';
import { toast } from 'sonner-native';
import DocumentsSkeleton from '../skeleton/DocumentsSkeleton';
import { selectCurrentRole } from '@/redux/authSlice';
import { useAppSelector } from '@/redux/store';

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
  const currentRole = useAppSelector(selectCurrentRole);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocumentCategoryFilter>('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('-createdAt');

  // Favorite API hooks
  const { data: favData, refetch: refetchFavs } = useGetAllfavouritesQuery({});
  const [createFavourite] = useCreateFavouriteMutation();
  const [deleteFavourite] = useDeleteFavouriteMutation();

  // Helper to check if a document is favorite
  const isFavorite = (docId: string) =>
    !!(
      favData &&
      favData.data &&
      Array.isArray(favData.data) &&
      favData.data.some((fav: any) => fav.documentId === docId)
    );

  // Toggle favorite handler
  const handleToggleFavorite = async (docId: string) => {
    try {
      if (isFavorite(docId)) {
        // Find the favorite record id
        // API expects DELETE /favorite/:document_id
        await deleteFavourite(docId).unwrap();
        toast.success('Removed from favorites');
      } else {
        await createFavourite({ documentId: docId }).unwrap();
        toast.success('Added to favorites');
      }
      refetchFavs();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update favorite');
    }
  };

  // API call for all documents
  const { data, isLoading, isFetching } = useGetAllDocumentsQuery({
    page,
    limit,
    search,
    sort,
    category: category === 'All' ? '' : category,
  });
  const documents = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  // For favorite screen, get only favorites
  const favoriteDocs =
    favData && favData.data && Array.isArray(favData.data)
      ? favData.data.map((fav: any) => fav.document)
      : [];

  const resolvedUserRole = useMemo(() => {
    if (userRole === 'admin') {
      return 'admin';
    }

    return currentRole === 'SUPERADMIN' ? 'admin' : 'user';
  }, [currentRole, userRole]);

  // Patch document to match DocumentCard expected props
  const renderDocument = ({ item }: { item: any }) => {
    const mappedDoc = {
      ...item,
      isFavorite: isFavorite(item.id),
    };
    return (
      <DocumentCard
        document={mappedDoc}
        onPress={() =>
          router.push({
            pathname: '/document/[id]',
            params: { id: item.id },
          })
        }
        onToggleFavorite={() => handleToggleFavorite(item.id)}
      />
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}>
      <HomeHeader userRole={resolvedUserRole} variant={headerVariant} />
      {/* Search, Category, Sort Controls */}
      <View style={{ paddingHorizontal: 18, paddingBottom: 8 }}>
        <DocumentSearchBar
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />
        <CategoryChips
          value={category}
          onChange={(cat) => {
            setCategory(cat);
            setPage(1);
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#9BA5B5', marginRight: 8 }}>Sort by:</Text>
          <TouchableOpacity
            onPress={() => {
              setSort(sort === '-createdAt' ? 'createdAt' : '-createdAt');
              setPage(1);
            }}
            style={styles.sortBtn}>
            <Text style={{ color: '#fff' }}>{sort === '-createdAt' ? 'Newest' : 'Oldest'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading || isFetching ? (
        <DocumentsSkeleton />
      ) : mode === 'favorite' ? (
        <FlatList
          data={favoriteDocs}
          keyExtractor={(item) => item.id}
          renderItem={renderDocument}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptyBody}>Tap the star on any card to add it to Favorite.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderDocument}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No documents found</Text>
              <Text style={styles.emptyBody}>Try a different category or search term.</Text>
            </View>
          }
        />
      )}
      {/* Pagination Controls */}
      <View style={styles.paginationWrap}>
        <TouchableOpacity
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}>
          <Text style={styles.pageBtnText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Page {meta.page} of {meta.totalPage}
        </Text>
        <TouchableOpacity
          onPress={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
          disabled={page >= meta.totalPage}
          style={[styles.pageBtn, page >= meta.totalPage && styles.pageBtnDisabled]}>
          <Text style={styles.pageBtnText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   safeArea: {
    paddingVertical: 12,
    paddingHorizontal: 10,

  },
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
  paginationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#1A2538',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageInfo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sortBtn: {
    backgroundColor: '#1A2538',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
