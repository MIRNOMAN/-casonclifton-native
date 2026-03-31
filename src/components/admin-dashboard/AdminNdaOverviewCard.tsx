import { Pencil } from 'lucide-react-native';
import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGetDocumentNdaQuery } from '@/redux/api/documentsApi';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type AdminNdaOverviewCardProps = {
  onOpen: () => void;
  onEdit: () => void;
};

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
  return anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });
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
      style={[{ width, height, borderRadius: 8, backgroundColor: '#1A2538', opacity }, style]}
    />
  );
}

function SkeletonCard() {
  const opacity = useShimmer();
  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={skeletonStyles.topRow}>
        <View style={{ gap: 8 }}>
          <SkeletonBox width={180} height={26} opacity={opacity} />
          <SkeletonBox width={140} height={14} opacity={opacity} />
        </View>
        <SkeletonBox width={72} height={36} opacity={opacity} style={{ borderRadius: 10 }} />
      </View>
      {/* Preview lines */}
      {[100, 88, 95, 75, 90, 80, 70, 85, 60, 78].map((w, i) => (
        <SkeletonBox
          key={i}
          width={`${w}%`}
          height={13}
          opacity={opacity}
          style={{ marginBottom: 12 }}
        />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
});

// ─────────────────────────────────────────────────────────────
// Helper — format date string
// ─────────────────────────────────────────────────────────────
function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export function AdminNdaOverviewCard({ onOpen, onEdit }: AdminNdaOverviewCardProps) {
  const { data, isLoading } = useGetDocumentNdaQuery();

  if (isLoading) return <SkeletonCard />;

  const ndaTitle   = data?.data?.title   ?? 'NDA Agreement';
  const ndaContent = data?.data?.content ?? '';
  const updatedAt  = formatDate(data?.data?.updatedAt);

  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.title}>{ndaTitle}</Text>
          <Text style={styles.updated}>Last updated: {updatedAt}</Text>
        </View>
        <Pressable
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil size={14} color="#8FA0BE" />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Text numberOfLines={10} style={styles.previewText}>
        {ndaContent}
      </Text>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111E34',
    borderRadius: 16,
    padding: 16,
  },
  cardPressed: {
    opacity: 0.95,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  updated: {
    color: '#A2AEC4',
    fontSize: 16,
  },
  editButton: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#30415E',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editText: {
    color: '#8FA0BE',
    fontSize: 16,
    fontWeight: '600',
  },
  previewText: {
    color: '#CCD4E3',
    fontSize: 17,
    lineHeight: 32,
  },
});