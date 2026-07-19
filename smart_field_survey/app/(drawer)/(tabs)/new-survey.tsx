import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useColorScheme } from '../../../hooks/use-color-scheme';

export default function NewSurveyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="New Survey" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
          Create Survey (Module 2)
        </Text>
        <Text style={styles.subtitle}>
          This screen will allow you to build and input survey forms, including Site Details, Clients, and Priorities.
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
