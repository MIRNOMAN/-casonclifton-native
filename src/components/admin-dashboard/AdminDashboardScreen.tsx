import { HomeHeader } from '@/components/documents/HomeHeader';
import { DocumentItem, INITIAL_DOCUMENTS } from '@/features/documents/documents-data';
import { router } from 'expo-router';
import { CircleOff, FileText, ShieldCheck, Upload } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminDeleteModal } from './AdminDeleteModal';
import { AdminDocumentCard } from './AdminDocumentCard';
import { AdminDocumentFormModal } from './AdminDocumentFormModal';
import { AdminNdaOverviewCard } from './AdminNdaOverviewCard';
import { AdminDocument, AdminFormPayload, AdminTab } from './types';

const INITIAL_ADMIN_DOCUMENTS: AdminDocument[] = INITIAL_DOCUMENTS.map((document) => ({
  ...document,
  tab: 'Documents',
}));

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function createDocumentFromForm(payload: AdminFormPayload): AdminDocument {
  const today = new Date();
  const day = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  return {
    id: `admin-${Date.now()}`,
    title: payload.title,
    category: payload.category,
    updatedAt: 'Just now',
    pages: 24,
    isFavorite: false,
    version: payload.version,
    effectiveDate: day,
    preparedBy: 'admin',
    sections: [
      {
        title: '1. Overview',
        body: `Generated document for ${payload.title}.`,
      },
    ],
    tab: payload.tab,
    fileName: payload.fileName || `${toSlug(payload.title) || 'document'}.pdf`,
    fileUri: payload.fileUri,
  };
}

export function AdminDashboardScreen() {
  const [documents, setDocuments] = useState<AdminDocument[]>(INITIAL_ADMIN_DOCUMENTS);
  const [activeTab, setActiveTab] = useState<AdminTab>('Documents');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDocument | null>(null);

  const filteredDocuments = useMemo(
    () => documents.filter((document) => document.tab === activeTab),
    [activeTab, documents]
  );

  const handleUploadSubmit = (payload: AdminFormPayload) => {
    const created = createDocumentFromForm(payload);
    setDocuments((current) => [created, ...current]);
  };

  const handleEditSubmit = (payload: AdminFormPayload) => {
    if (!editTarget) return;

    setDocuments((current) =>
      current.map((document) =>
        document.id === editTarget.id
          ? {
              ...document,
              title: payload.title,
              category: payload.category,
              version: payload.version,
              fileName: payload.fileName || document.fileName,
              fileUri: payload.fileUri || document.fileUri,
              tab: payload.tab,
              updatedAt: 'Just now',
            }
          : document
      )
    );
    setEditTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    setDocuments((current) => current.filter((document) => document.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

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

  const totalDocs = documents.length;
  const updatedToday = documents.filter((document) => document.updatedAt === 'Just now').length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <HomeHeader variant="admin" userRole="admin" />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalDocs}</Text>
            <Text style={styles.statLabel}>Total Docs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{updatedToday}</Text>
            <Text style={styles.statLabel}>Updated Today</Text>
          </View>
        </View>

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

          {activeTab === 'Documents' ? (
            <Pressable style={styles.uploadFab} onPress={() => setUploadOpen(true)}>
              <Upload size={16} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

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

      <AdminDocumentFormModal
        visible={uploadOpen}
        mode="upload"
        defaultTab={activeTab}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUploadSubmit}
      />

      <AdminDocumentFormModal
        visible={Boolean(editTarget)}
        mode="edit"
        defaultTab={activeTab}
        initialDocument={editTarget ?? undefined}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSubmit}
      />

      <AdminDeleteModal
        visible={Boolean(deleteTarget)}
        title={deleteTarget?.title ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  statLabel: {
    color: '#CFD6E3',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
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
