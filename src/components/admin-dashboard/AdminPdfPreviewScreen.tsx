import { getDocumentById } from '@/features/documents/documents-data';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AdminPdfPreviewScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    version?: string;
    effectiveDate?: string;
    preparedBy?: string;
  }>();

  const document = params.id ? getDocumentById(params.id) : undefined;

  const title = document?.title ?? params.title ?? 'Document Preview';
  const version = document?.version ?? params.version ?? '1.0';
  const effectiveDate = document?.effectiveDate ?? params.effectiveDate ?? '12/05/2026';
  const preparedBy = document?.preparedBy ?? params.preparedBy ?? 'admin';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>
      </View>

      <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>Version: {version}</Text>
        <Text style={styles.meta}>Effective Date: {effectiveDate}</Text>
        <Text style={styles.meta}>Prepared By: {preparedBy}</Text>
        <View style={styles.separator} />

        {document?.sections?.length ? (
          document.sections.map((section) => (
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
          ))
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Overview</Text>
            <Text style={styles.sectionBody}>
              No detailed content is available for this document yet.
            </Text>
          </View>
        )}
      </ScrollView>
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
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
});
