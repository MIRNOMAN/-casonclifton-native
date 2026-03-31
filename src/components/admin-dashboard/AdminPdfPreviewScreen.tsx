import { useGetSingleDocumentQuery } from '@/redux/api/documentsApi';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPreview from '../common/DocumentViewer';

// ─────────────────────────────────────────────────────────────
// Shimmer hook
// ─────────────────────────────────────────────────────────────
function useShimmer() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);
  return anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });
}

// ─────────────────────────────────────────────────────────────
// Skeleton
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
      style={[{ width, height, borderRadius: 6, backgroundColor: '#D1D5DB', opacity }, style]}
    />
  );
}

function PdfSkeleton() {
  const opacity = useShimmer();
  return (
    <View style={skeletonStyles.container}>
      {/* Title block */}
      <SkeletonBox width="60%" height={18} opacity={opacity} style={{ marginBottom: 12 }} />
      <SkeletonBox width="40%" height={13} opacity={opacity} style={{ marginBottom: 6 }} />
      <SkeletonBox width="45%" height={13} opacity={opacity} style={{ marginBottom: 6 }} />
      <SkeletonBox width="35%" height={13} opacity={opacity} style={{ marginBottom: 18 }} />

      {/* Separator */}
      <View style={skeletonStyles.separator} />

      {/* Body lines */}
      {[100, 95, 88, 100, 72, 90, 80, 95, 65, 88, 100, 78, 85, 60, 92].map((w, i) => (
        <SkeletonBox
          key={i}
          width={`${w}%`}
          height={13}
          opacity={opacity}
          style={{ marginBottom: 11 }}
        />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 18,
  },
});

// ─────────────────────────────────────────────────────────────
// Error state
// ─────────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <View style={errorStyles.wrap}>
      <Text style={errorStyles.icon}>⚠️</Text>
      <Text style={errorStyles.title}>Failed to load document</Text>
      <Text style={errorStyles.body}>{message}</Text>
    </View>
  );
}

const errorStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  icon: { fontSize: 36 },
  title: { color: '#111827', fontSize: 16, fontWeight: '700' },
  body: { color: '#6B7280', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

// ─────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────
export function AdminPdfPreviewScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    version?: string;
    effectiveDate?: string;
    preparedBy?: string;
  }>();

  // ── Fetch document by id ──────────────────────────────────────────────────
  const { data, isLoading, isError } = useGetSingleDocumentQuery(params.id ?? '', {
    skip: !params.id,
  });

  // ── Derived values — API takes priority, params are fallback ──────────────
  const title = data?.data?.title ?? params.title ?? 'Document Preview';
  const version = data?.data?.version ?? params.version ?? '1.0';
  const effectiveDate = data?.data?.createdAt?.split('T')[0] ?? params.effectiveDate ?? '—';
  const preparedBy = data?.data?.createdBy ?? params.preparedBy ?? 'admin';
  const fileUrl = data?.data?.fileUrl;

  // Google Docs PDF viewer — works for remote PDFs on both iOS & Android
  const pdfViewerUri = fileUrl
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>
      </View>

      {/* ── Body ── */}
      {isLoading ? (
        <PdfSkeleton />
      ) : isError || !fileUrl ? (
        <ErrorState
          message={
            isError
              ? 'Could not fetch document details. Please try again.'
              : 'No PDF file is attached to this document.'
          }
        />
      ) : (
        <View style={styles.pdfContainer}>
          {/* Meta bar above the PDF */}
          <View style={styles.metaBar}>
            {/* <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Version</Text>
              <Text style={styles.metaValue}>{version}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Effective Date</Text>
              <Text style={styles.metaValue}>{effectiveDate}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Prepared By</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {preparedBy}
              </Text>
            </View> */}
          </View>

          {/* PDF rendered via Google Docs viewer */}
          <DocumentPreview fileUrl={fileUrl!} />
        </View>
      )}
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
  header: {
    height: 56,
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
    backgroundColor: '#1A2538',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6FB',

    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '700',
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  webview: {
    flex: 1,
  },
});
