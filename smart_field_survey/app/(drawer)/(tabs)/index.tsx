import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys } from '../../../context/SurveyContext';
import CustomHeader from '../../../components/CustomHeader';
import { useColorScheme } from '../../../hooks/use-color-scheme';

export default function DashboardScreen() {
  const { surveys } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const todaySurveys = surveys.filter((s) => s.date === todayStr);
  const todayCount = todaySurveys.length;
  const totalCount = surveys.length;
  const recentSurveys = surveys.slice(0, 3); // Get 3 most recent

  // Quick Action Grid Items
  const quickActions = [
    {
      title: 'New Survey',
      icon: 'document-text',
      color: '#0ea5e9',
      bgColor: isDark ? '#082f49' : '#e0f2fe',
      route: '/(drawer)/(tabs)/new-survey',
      description: 'Start inspection',
    },
    {
      title: 'Camera',
      icon: 'camera',
      color: '#10b981',
      bgColor: isDark ? '#064e3b' : '#d1fae5',
      route: '/(drawer)/camera',
      description: 'Capture photo',
    },
    {
      title: 'Location',
      icon: 'location',
      color: '#f59e0b',
      bgColor: isDark ? '#78350f' : '#fef3c7',
      route: '/(drawer)/location',
      description: 'GPS coordinates',
    },
    {
      title: 'Contacts',
      icon: 'people',
      color: '#8b5cf6',
      bgColor: isDark ? '#4c1d95' : '#ede9fe',
      route: '/(drawer)/contacts',
      description: 'Select client',
    },
  ];

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="Field Survey" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Banner */}
        <View style={[styles.welcomeBanner, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <View>
            <Text style={[styles.welcomeGreeting, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              Hello, Nishit! 👋
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              Welcome back to your inspection dashboard.
            </Text>
          </View>
        </View>

        {/* Student Details Card */}
        <View style={[styles.studentCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.studentHeader}>
            <Ionicons name="school" size={24} color="#0a7ea4" />
            <Text style={[styles.studentTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              Developer / Student Details
            </Text>
          </View>
          <View style={styles.studentInfoGrid}>
            <View style={styles.studentInfoItem}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Nishit</Text>
            </View>
            <View style={styles.studentInfoItem}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>React Native Mini Project</Text>
            </View>
            <View style={styles.studentInfoItem}>
              <Text style={styles.infoLabel}>Assignment</Text>
              <Text style={[styles.infoValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Smart Field Survey App</Text>
            </View>
          </View>
        </View>

        {/* Survey Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="today" size={24} color="#0ea5e9" />
            </View>
            <Text style={[styles.statNumber, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>{todayCount}</Text>
            <Text style={styles.statLabel}>{"Today's Surveys"}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="albums" size={24} color="#8b5cf6" />
            </View>
            <Text style={[styles.statNumber, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Surveys</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          {quickActions.map((action, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.gridCard,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: action.bgColor }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={[styles.gridCardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                {action.title}
              </Text>
              <Text style={styles.gridCardDesc}>{action.description}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Survey Summary */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
          Recent Surveys
        </Text>
        {recentSurveys.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <Ionicons name="file-tray-outline" size={48} color="#94a3b8" />
            <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              No surveys created yet.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/(drawer)/(tabs)/new-survey')}
            >
              <Text style={styles.emptyButtonText}>Create Survey</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentSurveys.map((survey) => (
              <Pressable
                key={survey.id}
                style={({ pressed }) => [
                  styles.recentCard,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    opacity: pressed ? 0.95 : 1,
                  },
                ]}
                onPress={() => router.push({ pathname: '/modal', params: { id: survey.id } })}
              >
                <View style={styles.recentCardHeader}>
                  <View>
                    <Text style={[styles.recentSite, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                      {survey.siteName}
                    </Text>
                    <Text style={styles.recentClient}>{survey.clientName}</Text>
                  </View>
                  <View style={[
                    styles.priorityBadge, 
                    { 
                      backgroundColor: 
                        survey.priority === 'High' ? '#fee2e2' :
                        survey.priority === 'Medium' ? '#fef3c7' : '#d1fae5'
                    }
                  ]}>
                    <Text style={[
                      styles.priorityText,
                      {
                        color:
                          survey.priority === 'High' ? '#ef4444' :
                          survey.priority === 'Medium' ? '#d97706' : '#10b981'
                      }
                    ]}>
                      {survey.priority}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.recentDesc} numberOfLines={2}>
                  {survey.description}
                </Text>

                <View style={styles.recentFooter}>
                  <View style={styles.recentMeta}>
                    <Ionicons name="calendar-outline" size={14} color="#64748b" />
                    <Text style={styles.recentMetaText}>{survey.date}</Text>
                  </View>
                  {survey.photoUri && (
                    <View style={styles.recentMeta}>
                      <Ionicons name="camera-outline" size={14} color="#64748b" />
                      <Text style={styles.recentMetaText}>Photo attached</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeBanner: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  studentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  studentTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  studentInfoGrid: {
    gap: 8,
  },
  studentInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gridIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  gridCardDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 16,
    fontWeight: '600',
  },
  emptyButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  recentList: {
    gap: 12,
  },
  recentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  recentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recentSite: {
    fontSize: 15,
    fontWeight: '700',
  },
  recentClient: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recentDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  recentFooter: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentMetaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
