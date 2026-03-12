import { Bell, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function HomeHeader() {
  return (
    <View style={styles.row}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Hi, Andre Dew!</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.location}>Portuguese (Brazil)</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.notificationButton}>
        <Bell size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF22',
  },
  avatarText: {
    color: '#0D1117',
    fontSize: 18,
    fontWeight: '700',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#182338',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
