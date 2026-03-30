import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function DocumentsSkeleton() {
  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.title} />
          <View style={styles.meta} />
          <View style={styles.line} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  card: {
    backgroundColor: '#1A2233',
    borderRadius: 12,
    marginBottom: 18,
    padding: 16,
  },
  title: {
    width: '60%',
    height: 18,
    backgroundColor: '#2C3650',
    borderRadius: 6,
    marginBottom: 10,
  },
  meta: {
    width: '40%',
    height: 12,
    backgroundColor: '#2C3650',
    borderRadius: 6,
    marginBottom: 8,
  },
  line: {
    width: '100%',
    height: 10,
    backgroundColor: '#2C3650',
    borderRadius: 6,
  },
});
