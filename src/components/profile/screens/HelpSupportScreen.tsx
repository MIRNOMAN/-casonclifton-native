import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput } from 'react-native';
import InputLabel from '../components/InputLabel';
import PrimaryButton from '../components/PrimaryButton';
import { styles } from '../styles';
import { useCreateSupportTicketMutation } from '@/redux/api/settings';

export default function HelpSupportScreen() {
  const [helpName, setHelpName] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [createSupportTicket, { isLoading }] = useCreateSupportTicketMutation();

  const submitHelp = async () => {
    if (!helpName || !helpEmail || !helpSubject || !helpMessage) {
      Alert.alert('Missing details', 'Please complete all fields before submitting.');
      return;
    }

    try {
      const payload = {
        name: helpName,
        email: helpEmail,
        subject: helpSubject,
        message: helpMessage,
      };
      const response = await createSupportTicket(payload).unwrap();
      Alert.alert(
        'Submitted',
        response?.message || 'Support request submitted. Our team will contact you soon.'
      );
      setHelpName('');
      setHelpEmail('');
      setHelpSubject('');
      setHelpMessage('');
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to submit support request.');
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
      <Text style={styles.helpText}>Need helpful resources and get the support you need.</Text>

      <InputLabel>Name</InputLabel>
      <TextInput
        value={helpName}
        onChangeText={setHelpName}
        placeholder="Enter your name"
        placeholderTextColor="#6E7D98"
        style={styles.input}
      />

      <InputLabel>Email</InputLabel>
      <TextInput
        keyboardType="email-address"
        autoCapitalize="none"
        value={helpEmail}
        onChangeText={setHelpEmail}
        placeholder="Enter your email"
        placeholderTextColor="#6E7D98"
        style={styles.input}
      />

      <InputLabel>Subject</InputLabel>
      <TextInput
        value={helpSubject}
        onChangeText={setHelpSubject}
        placeholder="Enter your subject"
        placeholderTextColor="#6E7D98"
        style={styles.input}
      />

      <InputLabel>Message</InputLabel>
      <TextInput
        multiline
        textAlignVertical="top"
        value={helpMessage}
        onChangeText={setHelpMessage}
        placeholder="Please describe your issue in detail..."
        placeholderTextColor="#6E7D98"
        style={[styles.input, styles.messageInput]}
      />

      <PrimaryButton title={`${isLoading ? 'Submitting...' : 'Submit'}`} onPress={submitHelp} />
    </ScrollView>
  );
}
