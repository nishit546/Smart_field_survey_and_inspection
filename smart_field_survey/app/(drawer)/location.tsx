import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { useColorScheme } from '../../hooks/use-color-scheme';

export default function LocationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="Location" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
          Location Module (Module 4)
        </Text>
        <Text style={styles.subtitle}>
          {"This screen will fetch and track the device's current location, showing details like latitude, longitude, and accuracy, along with options to refresh and copy coordinates."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
