import DocumentPreview from '@/components/common/DocumentViewer';
import { useGetSingleDocumentQuery } from '@/redux/api/documentsApi';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DocumentPreviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { data: documentRaw } = useGetSingleDocumentQuery(id!, {
    skip: !id,
  });

  const document = documentRaw?.data;

  if (!document) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missingWrap}>
          <Text style={styles.missingTitle}>Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{document.title}</Text>
      </View>

      <DocumentPreview fileUrl={document.fileUrl} />

      {/* <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
        <Text style={styles.title}>{document.title}</Text>
        <Text style={styles.meta}>Version: {document.version}</Text>
        <Text style={styles.meta}>Effective Date: {document.effectiveDate}</Text>
        <Text style={styles.meta}>Prepared By: {document.preparedBy}</Text>
        <View style={styles.separator} />

        {document.sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
            {section.bullets?.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000E26',
  },
  header: {
    height: 88,
    paddingTop: 20,
    paddingHorizontal: 18,
    backgroundColor: '#000E26',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  pageContent: {
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#31353B',
    marginBottom: 8,
  },
  meta: {
    color: '#7A7F87',
    fontSize: 14,
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginTop: 14,
  },
  section: {
    paddingTop: 14,
  },
  sectionTitle: {
    color: '#31353B',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    color: '#6A7078',
    fontSize: 14,
    lineHeight: 26,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  bullet: {
    color: '#6A7078',
    fontSize: 16,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    color: '#6A7078',
    fontSize: 14,
    lineHeight: 24,
  },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingTitle: {
    color: '#20262E',
    fontSize: 18,
    fontWeight: '700',
  },
});
