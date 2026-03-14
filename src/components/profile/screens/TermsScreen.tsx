import React from 'react';
import { ScrollView, Text } from 'react-native';
import { styles } from '../styles';

export default function TermsScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.policyParagraph}>
        By using the AppGlobal app, you agree to comply with these terms. Please read them carefully
        before using our services.
      </Text>

      <Text style={styles.policyHeading}>How We Use Your Information</Text>
      <Text style={styles.policyBullet}>- Provide and improve our app's services.</Text>
      <Text style={styles.policyBullet}>- Communicate with updates and account notices.</Text>
      <Text style={styles.policyBullet}>- Personalize your experience and recommendations.</Text>
      <Text style={styles.policyBullet}>- Ensure app security and integrity.</Text>
    </ScrollView>
  );
}
