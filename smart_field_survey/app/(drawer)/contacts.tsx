import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { useColorScheme } from '../../hooks/use-color-scheme';

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="Contacts" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
          Contacts Module (Module 5)
        </Text>
        <Text style={styles.subtitle}>
          This screen will import and fetch device contacts, allowing search, pull-to-refresh, contact avatar generation, copying numbers, and empty-state handling.
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
