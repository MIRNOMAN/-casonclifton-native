import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AlertTriangle, FileText } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

const SECTIONS = [
  {
    title: '1. Confidential Information',
    body: 'All documents, procedures, instructional materials, technical specifications, and any other information accessed through the Creston Document Management System (the Platform) are considered Confidential Information.',
  },
  {
    title: '2. Obligations',
    body: 'The Receiving Party agrees to: (a) hold and maintain the Confidential Information in strict confidence; (b) not to disclose, publish, or otherwise reveal any of the Confidential Information to any third party; (c) not to copy, reproduce, or download any documents from the Platform unless explicitly authorized.',
  },
  {
    title: '3. Duration',
    body: 'This Agreement and the obligations herein shall remain in effect for a period of five (5) years from the date of acceptance, or until the Confidential Information no longer qualifies as confidential, whichever is later.',
  },
  {
    title: '4. Remedies',
    body: 'The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm and that monetary damages may be inadequate. The Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance.',
  },
  {
    title: '5. Return of Materials',
    body: 'Upon termination of employment or this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof.',
  },
];

export default function AggrementScreen() {
  const [accepted, setAccepted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleContinue = () => {
    if (!accepted) return;
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Image
          source={require('../../../assets/images/logo/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text className="mb-2 text-center text-[26px] leading-9 font-bold text-white">
          Non-Disclosure Agreement
        </Text>
        <Text className="mb-6 text-center text-base leading-6 text-[#9CA3AF]">
          Please review and accept before{`\n`}accessing documents
        </Text>

        <View style={styles.warningCard}>
          <AlertTriangle size={20} color="#FE6F61" />
          <Text style={styles.warningText}>
            This agreement is legally binding All documents accessed through this platform are
            strictly confidential
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}
        </ScrollView>

        <Pressable style={styles.checkboxRow} onPress={() => setAccepted((value) => !value)}>
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
          onPress={handleContinue}>
          <FileText size={18} color={accepted ? '#0D1117' : '#7C8597'} />
          <Text style={[styles.buttonText, accepted && styles.buttonTextEnabled]}>
            Accept & Continue
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

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
    lineHeight: 15,
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
