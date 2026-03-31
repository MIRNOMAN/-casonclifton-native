import { HomeHeader } from '@/components/documents/HomeHeader';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetDocumentNdaQuery,
  useUpdateDocumentNdaMutation,
} from '@/redux/api/documentsApi';

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
        <SkeletonBox width={90} height={40} opacity={opacity} style={{ borderRadius: 10 }} />
      </View>

      {/* Editor area */}
      <Animated.View style={[skeletonStyles.editorBlock, { opacity }]}>
        {[100, 85, 95, 70, 90, 80, 60, 88, 75, 65].map((w, i) => (
          <SkeletonBox
            key={i}
            width={`${w}%`}
            height={14}
            opacity={opacity}
            style={{ marginBottom: 14 }}
          />
        ))}
      </Animated.View>

      {/* Action buttons */}
      <View style={skeletonStyles.actionsRow}>
        <SkeletonBox width="47%" height={44} opacity={opacity} style={{ borderRadius: 8 }} />
        <SkeletonBox width="47%" height={44} opacity={opacity} style={{ borderRadius: 8 }} />
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
  editorBlock: {
    flex: 1,
    backgroundColor: '#111E34',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

// ─────────────────────────────────────────────────────────────
// Toast component
// ─────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        toastStyles.wrap,
        type === 'success' ? toastStyles.success : toastStyles.error,
        { opacity },
      ]}
    >
      <Text style={toastStyles.text}>{message}</Text>
    </Animated.View>
  );
}

const toastStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  success: { backgroundColor: '#12D7CC' },
  error: { backgroundColor: '#EF4444' },
  text: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});

// ─────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────
export function AdminNdaEditScreen() {
  const [value, setValue] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const prevIsUpdating = useRef(false);

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading } = useGetDocumentNdaQuery();

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [updateDocumentNda, { isLoading: isUpdating }] = useUpdateDocumentNdaMutation();

  // ── Seed editor with fetched NDA content ──────────────────────────────────
  useEffect(() => {
    if (data?.data?.content) {
      setValue(data.data.content);
    } else if (data?.data?.title) {
      // fallback: use title if content missing
      setValue(data.data.title);
    }
  }, [data]);

  // ── Detect when update finishes ───────────────────────────────────────────
  useEffect(() => {
    if (prevIsUpdating.current && !isUpdating) {
      // mutation just completed — toast is already shown in handleSave
    }
    prevIsUpdating.current = isUpdating;
  }, [isUpdating]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      await updateDocumentNda({
        title: data?.data?.title ?? 'This Non-Disclosure Agreement',
        content: value,
      }).unwrap();

      setToast({ message: 'NDA saved successfully!', type: 'success' });
      setTimeout(() => {
        setToast(null);
        router.back();
      }, 2200);
    } catch (error) {
      console.error('Update NDA failed:', error);
      setToast({ message: 'Failed to save NDA. Try again.', type: 'error' });
      setTimeout(() => setToast(null), 2500);
    }
  };

  // ── Skeleton on first load ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerWrap}>
          <HomeHeader variant="admin" userRole="admin" />
        </View>
        <SkeletonScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <HomeHeader variant="admin" userRole="admin" />

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

        {/* Editor */}
        <View style={styles.editorWrap}>
          <TextInput
            value={value}
            onChangeText={setValue}
            multiline
            textAlignVertical="top"
            style={styles.editorInput}
            placeholder="Enter NDA content..."
            placeholderTextColor="#4A5568"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isUpdating}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text style={styles.saveText}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
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
    paddingTop: 12,
    paddingBottom: 20,
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
  editorWrap: {
    flex: 1,
    backgroundColor: '#111E34',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  editorInput: {
    color: '#E3E8F1',
    fontSize: 18,
    lineHeight: 34,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#41516D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#A8B3C7',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  saveText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
});