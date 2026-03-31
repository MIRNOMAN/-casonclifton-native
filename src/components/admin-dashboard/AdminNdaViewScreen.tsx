import { HomeHeader } from '@/components/documents/HomeHeader';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNdaOverviewCard } from './AdminNdaOverviewCard';
import { useGetDocumentNdaQuery } from '@/redux/api/documentsApi';

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

function SkeletonScreen() {
  const opacity = useShimmer();
  return (
    <View style={skeletonStyles.container}>
      {/* Tab row */}
      <View style={skeletonStyles.tabRow}>
        <SkeletonBox width={110} height={40} opacity={opacity} style={{ borderRadius: 10 }} />
        <SkeletonBox width={90}  height={40} opacity={opacity} style={{ borderRadius: 10 }} />
      </View>

      {/* Card */}
      <View style={skeletonStyles.card}>
        <View style={skeletonStyles.cardTopRow}>
          <View style={{ gap: 8 }}>
            <SkeletonBox width={180} height={26} opacity={opacity} />
            <SkeletonBox width={140} height={14} opacity={opacity} />
          </View>
          <SkeletonBox width={72} height={36} opacity={opacity} style={{ borderRadius: 10 }} />
        </View>
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
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#111E34',
    borderRadius: 16,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
});

// ─────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────
export function AdminNdaViewScreen() {
  const { isLoading } = useGetDocumentNdaQuery();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerWrap}>
        <HomeHeader variant="admin" userRole="admin" />
      </View>

      {isLoading ? (
        <SkeletonScreen />
      ) : (
        <View style={styles.content}>
          {/* Tab row */}
          <View style={styles.tabRow}>
            <Pressable style={styles.tabChip} onPress={() => router.back()}>
              <Text style={styles.tabText}>Documents</Text>
            </Pressable>
            <Pressable style={[styles.tabChip, styles.tabChipActive]}>
              <ShieldCheck size={14} color="#12D7CC" />
              <Text style={[styles.tabText, styles.tabTextActive]}>NDA</Text>
            </Pressable>
          </View>

          {/* NDA card — fetches its own data internally */}
          <AdminNdaOverviewCard
            onOpen={() => {}}
            onEdit={() => router.push('/admin/nda-edit')}
          />
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
  headerWrap: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 0,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tabChip: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#142038',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
});