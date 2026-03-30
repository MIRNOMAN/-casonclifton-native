import { FAQ_ITEMS } from '@/components/profile/data';
import { ScreenKey } from '@/components/profile/types';
import { BlurView } from 'expo-blur';
import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { styles } from '../styles';

type FaqsScreenProps = {
  onNavigate: (screen: ScreenKey) => void;
};

export default function FaqsScreen({ onNavigate }: FaqsScreenProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>('verify-account');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      {FAQ_ITEMS.map((faq) => {
        const isOpen = openFaqId === faq.id;
        return (
          <Pressable
            key={faq.id}
            onPress={() => setOpenFaqId(isOpen ? null : faq.id)}
            style={({ pressed }) => [styles.faqCard, pressed && styles.rowPressed]}>
            <BlurView
              intensity={38}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.faqQuestionWrap}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <ChevronDown
                size={16}
                color="#A3B0C7"
                style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
              />
            </View>
            {isOpen ? <Text style={styles.faqAnswer}>{faq.answer}</Text> : null}
          </Pressable>
        );
      })}


    </ScrollView>
  );
}
