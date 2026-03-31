import { HomeHeader } from '@/components/documents/HomeHeader';
import { router } from 'expo-router';
import { CircleOff, FileText, ShieldCheck, Upload } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminDeleteModal } from './AdminDeleteModal';
import { AdminDocumentCard } from './AdminDocumentCard';
import { AdminDocumentFormModal } from './AdminDocumentFormModal';
import { AdminNdaOverviewCard } from './AdminNdaOverviewCard';
import { AdminDocument, AdminFormPayload, AdminTab } from './types';
import {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useGetAllDocumentsQuery,
  useUpdateDocumentMutation,
} from '@/redux/api/documentsApi';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type ApiDocument = {
  id: string;
  title: string;
  category: string;
  version: string;
  fileName: string;
  fileUrl: string;
  pages: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

function mapApiDocToAdminDoc(doc: ApiDocument): AdminDocument {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category as any,
    version: doc.version,
    fileName: doc.fileName,
    fileUri: doc.fileUrl,
    pages: doc.pages,
    updatedAt: doc.updatedAt,
    isFavorite: false,
    effectiveDate: doc.createdAt?.split('T')[0] ?? '',
    preparedBy: doc.createdBy ?? 'admin',
    sections: [],
    tab: 'Documents',
  };
}

// ─────────────────────────────────────────────────────────────
// Shimmer hook — single shared animation for all skeletons
// ─────────────────────────────────────────────────────────────
function useShimmer() {
  const anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });

  return opacity;
}

// ─────────────────────────────────────────────────────────────
// Skeleton primitives
// ─────────────────────────────────────────────────────────────
function SkeletonBox({
  width,
  height,
  style,
  opacity,
}: {
  width: number | string;
  height: number;
  style?: object;
  opacity: Animated.AnimatedInterpolation<number>;
}) {
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 8,
          backgroundColor: '#1A2538',
          opacity,
        },
        style,
      ]}
    />
  );
}

function SkeletonStatCard({ opacity }: { opacity: Animated.AnimatedInterpolation<number> }) {
  return (
    <View style={skeletonStyles.statCard}>
      <SkeletonBox width={48} height={28} opacity={opacity} style={{ marginBottom: 8 }} />
      <SkeletonBox width={72} height={12} opacity={opacity} />
    </View>
  );
}

function SkeletonDocumentCard({ opacity }: { opacity: Animated.AnimatedInterpolation<number> }) {
  return (
    <View style={skeletonStyles.docCard}>
      <View style={skeletonStyles.docCardLeft}>
        <SkeletonBox width={130} height={14} opacity={opacity} style={{ marginBottom: 10 }} />
        <SkeletonBox width={85} height={10} opacity={opacity} />
      </View>
      <SkeletonBox width={80} height={30} opacity={opacity} style={{ borderRadius: 8 }} />
    </View>
  );
}

function SkeletonScreen() {
  const opacity = useShimmer();

  return (
    <View style={skeletonStyles.container}>
      {/* Header */}
      <View style={skeletonStyles.headerRow}>
        <SkeletonBox width={160} height={20} opacity={opacity} />
        <SkeletonBox width={40} height={40} opacity={opacity} style={{ borderRadius: 20 }} />
      </View>

      {/* Stats */}
      <View style={skeletonStyles.statsRow}>
        <SkeletonStatCard opacity={opacity} />
        <SkeletonStatCard opacity={opacity} />
      </View>

      {/* Tabs */}
      <View style={skeletonStyles.tabsRow}>
        <SkeletonBox width={110} height={38} opacity={opacity} style={{ borderRadius: 10 }} />
        <SkeletonBox width={80} height={38} opacity={opacity} style={{ borderRadius: 10 }} />
      </View>

      {/* Cards */}
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonDocumentCard key={i} opacity={opacity} />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    minHeight: 84,
    borderRadius: 14,
    backgroundColor: '#0D1B2E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  docCard: {
    height: 68,
    borderRadius: 12,
    backgroundColor: '#0D1B2E',
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docCardLeft: {
    flex: 1,
    paddingRight: 16,
  },
});

// ─────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────
export function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<AdminTab>('Documents');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDocument | null>(null);
  const [page, setPage] = useState<number>(1);
  const [allDocs, setAllDocs] = useState<AdminDocument[]>([]);
  const prevIsCreating = useRef(false);
  const prevIsUpdating = useRef(false);
  // ── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useGetAllDocumentsQuery({ page, limit: 10 });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [createDocument, { isLoading: isCreating }] = useCreateDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] = useUpdateDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  // ── Accumulate pages ──────────────────────────────────────────────────────
  useEffect(() => {
    if (data?.data) {
      const mapped: AdminDocument[] = data.data.map(mapApiDocToAdminDoc);
      if (page === 1) {
        setAllDocs(mapped);
      } else {
        setAllDocs((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          return [...prev, ...mapped.filter((d) => !existingIds.has(d.id))];
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (prevIsCreating.current && !isCreating) {
      setUploadOpen(false);
    }
    prevIsCreating.current = isCreating;
  }, [isCreating]);

  useEffect(() => {
    if (prevIsUpdating.current && !isUpdating) {
      setEditTarget(null);
    }
    prevIsUpdating.current = isUpdating;
  }, [isUpdating]);

  const handleLoadMore = () => {
    if (data?.meta?.totalPage && page < data.meta.totalPage && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filteredDocuments = useMemo(
    () => allDocs.filter((doc) => doc.tab === activeTab),
    [activeTab, allDocs]
  );

  // ── Create ────────────────────────────────────────────────────────────────
  const handleUploadSubmit = async (payload: AdminFormPayload) => {
    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          title: payload.title,
          category: payload.category,
          version: payload.version,
        })
      );
      if (payload.fileUri && payload.fileName) {
        formData.append('file', {
          uri: payload.fileUri,
          name: payload.fileName,
          type: 'application/pdf',
        } as any);
      }
      await createDocument(formData).unwrap();
      setPage(1);
      setUploadOpen(false);
    } catch (error) {
      console.error('Create document failed:', error);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleEditSubmit = async (payload: AdminFormPayload) => {
    if (!editTarget) return;
    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          title: payload.title,
          category: payload.category,
          version: payload.version,
        })
      );
      if (payload.fileUri && payload.fileName) {
        formData.append('file', {
          uri: payload.fileUri,
          name: payload.fileName,
          type: 'application/pdf',
        } as any);
      }
      await updateDocument({ id: editTarget.id, formData }).unwrap();
      setAllDocs((prev) =>
        prev.map((doc) =>
          doc.id === editTarget.id
            ? {
                ...doc,
                title: payload.title,
                category: payload.category as any,
                version: payload.version,
                fileName: payload.fileName ?? doc.fileName,
                fileUri: payload.fileUri ?? doc.fileUri,
                tab: payload.tab,
                updatedAt: new Date().toISOString(),
              }
            : doc
        )
      );
      setEditTarget(null);
    } catch (error) {
      console.error('Update document failed:', error);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument(deleteTarget.id).unwrap();
      setAllDocs((prev) => prev.filter((doc) => doc.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete document failed:', error);
    }
  };

  // ── Open document ─────────────────────────────────────────────────────────
  const handleOpenDocument = (document: AdminDocument) => {
    router.push({
      pathname: '/admin/pdf-preview/[id]',
      params: {
        id: document.id,
        title: document.title,
        version: document.version,
        effectiveDate: document.effectiveDate,
        preparedBy: document.preparedBy,
      },
    });
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalDocs = data?.meta?.total ?? allDocs.length;

  // ── Skeleton on first load ────────────────────────────────────────────────
  if (isLoading && page === 1) {
    return (
      <SafeAreaView style={styles.safe}>
        <SkeletonScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <HomeHeader variant="admin" userRole="admin" />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalDocs}</Text>
            <Text style={styles.statLabel}>Total Documents</Text>
          </View>
      
        </View>

        {/* Tab filter + upload button */}
        <View style={styles.filterRow}>
          <View style={styles.tabGroup}>
            <Pressable
              style={[styles.tabChip, activeTab === 'Documents' && styles.tabChipActive]}
              onPress={() => setActiveTab('Documents')}>
              <FileText size={14} color={activeTab === 'Documents' ? '#12D7CC' : '#9CA8BE'} />
              <Text style={[styles.tabText, activeTab === 'Documents' && styles.tabTextActive]}>
                Documents
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabChip, activeTab === 'NDA' && styles.tabChipActive]}
              onPress={() => setActiveTab('NDA')}>
              <ShieldCheck size={14} color={activeTab === 'NDA' ? '#12D7CC' : '#9CA8BE'} />
              <Text style={[styles.tabText, activeTab === 'NDA' && styles.tabTextActive]}>NDA</Text>
            </Pressable>
          </View>

          {activeTab === 'Documents' && (
            <Pressable style={styles.uploadFab} onPress={() => setUploadOpen(true)}>
              <Upload size={16} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {/* Content */}
        {activeTab === 'NDA' ? (
          <AdminNdaOverviewCard
            onOpen={() => router.push('/admin/nda')}
            onEdit={() => router.push('/admin/nda-edit')}
          />
        ) : (
          <FlatList
            data={filteredDocuments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetching ? (
                <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
                  Loading more...
                </Text>
              ) : null
            }
            renderItem={({ item }) => (
              <AdminDocumentCard
                document={item}
                onOpen={handleOpenDocument}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <CircleOff size={22} color="#8D99AE" />
                <Text style={styles.emptyTitle}>No {activeTab} found</Text>
                <Text style={styles.emptyBody}>Create a new file from the upload button.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Upload modal */}
      <AdminDocumentFormModal
        visible={uploadOpen}
        mode="upload"
        defaultTab={activeTab}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        isSubmitting={isCreating}
      />

      {/* Edit modal */}
      <AdminDocumentFormModal
        visible={Boolean(editTarget)}
        mode="edit"
        defaultTab={activeTab}
        initialDocument={editTarget ?? undefined}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      {/* Delete modal */}
      <AdminDeleteModal
        visible={Boolean(deleteTarget)}
        title={deleteTarget?.title ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    minHeight: 84,
    borderRadius: 14,
    backgroundColor: '#1A2538',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  statLabel: {
    color: '#CFD6E3',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  tabChip: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#142038',
    flexDirection: 'row',
    alignItems: 'center',
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
  uploadFab: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#12D7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    color: '#8D99AE',
    fontSize: 14,
  },
});