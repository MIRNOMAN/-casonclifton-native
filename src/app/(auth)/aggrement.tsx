import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AlertTriangle, FileText } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
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
  return anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.65] });
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
      style={[{ width, height, borderRadius: 6, backgroundColor: '#1A2538', opacity }, style]}
    />
  );
}

function SkeletonScreen() {
  const opacity = useShimmer();
  return (
    <View style={skeletonStyles.container}>
      {/* Logo placeholder */}
      <SkeletonBox
        width={118}
        height={48}
        opacity={opacity}
        style={{ alignSelf: 'center', marginBottom: 20, borderRadius: 8 }}
      />

      {/* Title + subtitle */}
      <SkeletonBox width="70%" height={22} opacity={opacity} style={{ alignSelf: 'center', marginBottom: 10 }} />
      <SkeletonBox width="55%" height={14} opacity={opacity} style={{ alignSelf: 'center', marginBottom: 6 }} />
      <SkeletonBox width="45%" height={14} opacity={opacity} style={{ alignSelf: 'center', marginBottom: 18 }} />

      {/* Warning card */}
      <View style={skeletonStyles.warningCard}>
        <SkeletonBox width={20} height={20} opacity={opacity} style={{ borderRadius: 10, flexShrink: 0 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width="100%" height={12} opacity={opacity} />
          <SkeletonBox width="75%" height={12} opacity={opacity} />
        </View>
      </View>

      {/* Section blocks */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={skeletonStyles.section}>
          <SkeletonBox width="45%" height={14} opacity={opacity} style={{ marginBottom: 10 }} />
          <SkeletonBox width="100%" height={11} opacity={opacity} style={{ marginBottom: 7 }} />
          <SkeletonBox width="95%" height={11} opacity={opacity} style={{ marginBottom: 7 }} />
          <SkeletonBox width="80%" height={11} opacity={opacity} />
        </View>
      ))}

      {/* Checkbox row */}
      <View style={skeletonStyles.checkboxRow}>
        <SkeletonBox width={16} height={16} opacity={opacity} style={{ borderRadius: 8, flexShrink: 0, marginTop: 2 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width="100%" height={10} opacity={opacity} />
          <SkeletonBox width="85%" height={10} opacity={opacity} />
        </View>
      </View>

      {/* Button */}
      <SkeletonBox width="100%" height={52} opacity={opacity} style={{ borderRadius: 12, marginTop: 8 }} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
  },
  warningCard: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: 'rgba(89, 35, 38, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(254, 160, 143, 0.22)',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
});

// ─────────────────────────────────────────────────────────────
// Helper — split NDA content into paragraphs/sections
// ─────────────────────────────────────────────────────────────
type Section = { title: string; body: string };

function parseNdaContent(content: string): Section[] {
  if (!content) return [];

  // Split on double newlines to get paragraphs
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return [];

  // If there's only one block, show it as a single section
  if (paragraphs.length === 1) {
    return [{ title: 'Agreement', body: paragraphs[0] }];
  }

  // Multiple paragraphs: number them
  return paragraphs.map((para, idx) => ({
    title: `${idx + 1}. ${para.split('.')[0].slice(0, 60)}`,
    body: para,
  }));
}

// ─────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────
export default function AggrementScreen() {
  const [accepted, setAccepted] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // ── Fetch NDA from API ────────────────────────────────────────────────────
  const { data, isLoading } = useGetDocumentNdaQuery();

  const ndaTitle   = data?.data?.title   ?? 'Non-Disclosure Agreement';
  const ndaContent = data?.data?.content ?? '';
  const sections   = parseNdaContent(ndaContent);

  // ── Entrance animation (runs after load) ─────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoading, fadeAnim, slideAnim]);

  const handleContinue = () => {
    if (!accepted) return;
    router.replace('/(auth)/login');
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <SkeletonScreen />
      </SafeAreaView>
    );
  }

  // ── Loaded ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image
          source={require('../../../assets/images/logo/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.heading}>{ndaTitle}</Text>
        <Text style={styles.subheading}>
          Please review and accept before{`\n`}accessing documents
        </Text>

        <View style={styles.warningCard}>
          <AlertTriangle size={20} color="#FE6F61" />
          <Text style={styles.warningText}>
            This agreement is legally binding. All documents accessed through this platform are
            strictly confidential.
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.length > 0 ? (
            sections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))
          ) : (
            // Fallback: render raw content if parsing yields nothing
            <View style={styles.section}>
              <Text style={styles.sectionBody}>{ndaContent || 'No content available.'}</Text>
            </View>
          )}
        </ScrollView>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAccepted((v) => !v)}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted ? <View style={styles.checkboxDot} /> : null}
          </View>
          <Text style={styles.checkboxText}>
            I have read and agree to the Non-Disclosure Agreement and understand that all documents
            on this platform are confidential.
          </Text>
        </Pressable>

        <Pressable
          disabled={!accepted}
          style={({ pressed }) => [
            styles.button,
            accepted ? styles.buttonEnabled : styles.buttonDisabled,
            pressed && accepted && styles.buttonPressed,
          ]}
          onPress={handleContinue}
        >
          <FileText size={18} color={accepted ? '#0D1117' : '#7C8597'} />
          <Text style={[styles.buttonText, accepted && styles.buttonTextEnabled]}>
            Accept & Continue
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
  },
  logoImage: {
    width: 118,
    height: 58,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  heading: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subheading: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    color: '#9CA3AF',
  },
  warningCard: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: 'rgba(89, 35, 38, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(254, 160, 143, 0.22)',
    marginBottom: 14,
  },
  warningText: {
    flex: 1,
    color: '#FE6F61',
    fontSize: 14,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    color: '#A8B0BE',
    fontSize: 13,
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FEA08F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#FEA08F',
  },
  checkboxDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0D1117',
  },
  checkboxText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 16,
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#172133',
  },
  buttonEnabled: {
    backgroundColor: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#7C8597',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextEnabled: {
    color: '#0D1117',
  },
});