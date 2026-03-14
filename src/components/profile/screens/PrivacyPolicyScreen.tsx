import React from 'react';
import { ScrollView, Text } from 'react-native';
import { styles } from '../styles';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.policyParagraph}>
        At AppGlobal, privacy matters. We respect and protect your information in every interaction.
      </Text>

      <Text style={styles.policyHeading}>How We Use Your Information</Text>
      <Text style={styles.policyBullet}>- To provide and improve our app's services.</Text>
      <Text style={styles.policyBullet}>- To communicate with you about updates and support.</Text>
      <Text style={styles.policyBullet}>- To personalize your experience and recommendations.</Text>

      <Text style={styles.policyHeading}>Information We Collect</Text>
      <Text style={styles.policyBullet}>
        - Name, email address, phone number, and profile details.
      </Text>
      <Text style={styles.policyBullet}>- Usage data to understand product performance.</Text>

      <Text style={styles.policyHeading}>Contact Us</Text>
      <Text style={styles.policyBullet}>- Email: support@globaldubai.app</Text>
      <Text style={styles.policyBullet}>- Phone: +123 456 7890</Text>
    </ScrollView>
  );
}
