import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput } from 'react-native';
import InputLabel from '../components/InputLabel';
import PrimaryButton from '../components/PrimaryButton';
import { styles } from '../styles';

export default function HelpSupportScreen() {
  const [helpName, setHelpName] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');

  const submitHelp = () => {
    if (!helpName || !helpEmail || !helpSubject || !helpMessage) {
      Alert.alert('Missing details', 'Please complete all fields before submitting.');
      return;
    }

    Alert.alert('Submitted', 'Support request submitted. Our team will contact you soon.');
    setHelpName('');
    setHelpEmail('');
    setHelpSubject('');
    setHelpMessage('');
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

      <PrimaryButton title="Submit" onPress={submitHelp} />
    </ScrollView>
  );
}
