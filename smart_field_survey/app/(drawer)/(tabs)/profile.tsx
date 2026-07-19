import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="Profile" />
      <View style={styles.content}>
        <View style={styles.avatarCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>NS</Text>
          </View>
          <Text style={[styles.name, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Nishit</Text>
          <Text style={styles.role}>Lead Field Inspector</Text>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
            Developer Information
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#0a7ea4" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Nishit</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color="#0a7ea4" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Student ID</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>SF-2026-99</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={20} color="#0a7ea4" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>React Native Mini Project</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="ribbon-outline" size={20} color="#0a7ea4" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Project Objective</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Smart Field Survey & Inspection App</Text>
            </View>
          </View>
        </View>
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
    padding: 20,
    alignItems: 'center',
  },
  avatarCard: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarTextLarge: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  detailsCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});
