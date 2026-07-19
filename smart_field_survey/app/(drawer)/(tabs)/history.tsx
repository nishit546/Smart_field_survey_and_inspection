import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys, Survey } from '../../../context/SurveyContext';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import CustomHeader from '../../../components/CustomHeader';

export default function HistoryScreen() {
  const { surveys, deleteSurvey } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API/db query reloading
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  // Handle single survey deletion with confirmation
  const handleDeleteSurvey = (id: string, siteName: string) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to permanently delete the inspection record for "${siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(id);
          },
        },
      ]
    );
  };

  // Filter surveys list dynamically
  const filteredSurveys = surveys.filter((survey) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      survey.siteName.toLowerCase().includes(query) ||
      survey.clientName.toLowerCase().includes(query);

    const matchesPriority = selectedPriority === 'All' || survey.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  // Render individual survey list cards
  const renderItem = ({ item }: { item: Survey }) => {
    const priorityColor =
      item.priority === 'High' ? '#ef4444' :
      item.priority === 'Medium' ? '#d97706' : '#10b981';

    const priorityBg =
      item.priority === 'High' ? '#fee2e2' :
      item.priority === 'Medium' ? '#fef3c7' : '#d1fae5';

    // Count linked attachments
    const hasPhoto = !!item.photoUri;
    const hasLocation = item.latitude !== undefined && item.longitude !== undefined;
    const hasContact = !!item.contactName;
    const hasNotes = !!item.notes;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.surveyCard,
          {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
        onPress={() => router.push({ pathname: '/modal', params: { id: item.id } })}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.siteName, { color: isDark ? '#f1f5f9' : '#1e293b' }]} numberOfLines={1}>
              {item.siteName}
            </Text>
            <Text style={styles.clientName}>{item.clientName}</Text>
          </View>

          <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: isDark ? '#cbd5e1' : '#475569' }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaInfo}>
            <Ionicons name="calendar-outline" size={14} color="#64748b" />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>

          {/* Attachment Badges Row */}
          <View style={styles.attachmentsRow}>
            {hasPhoto && (
              <View style={styles.attachmentIcon}>
                <Ionicons name="camera" size={14} color="#6d28d9" />
              </View>
            )}
            {hasLocation && (
              <View style={styles.attachmentIcon}>
                <Ionicons name="location" size={14} color="#6d28d9" />
              </View>
            )}
            {hasContact && (
              <View style={styles.attachmentIcon}>
                <Ionicons name="person" size={14} color="#6d28d9" />
              </View>
            )}
            {hasNotes && (
              <View style={styles.attachmentIcon}>
                <Ionicons name="clipboard" size={14} color="#6d28d9" />
              </View>
            )}
          </View>

          {/* Inline Delete Trigger */}
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeleteSurvey(item.id, item.siteName)}
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  // Render Empty State Screen
  const renderEmptyState = () => (
    <View style={[styles.emptyCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
      <Ionicons name="file-tray-stacked-outline" size={64} color="#94a3b8" />
      <Text style={[styles.emptyTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>No Inspections Found</Text>
      <Text style={styles.emptyDesc}>
        {searchQuery || selectedPriority !== 'All'
          ? 'No survey records match your search query or filters.'
          : 'You have not submitted any field surveys yet.'}
      </Text>
      {!searchQuery && selectedPriority === 'All' && (
        <Pressable
          style={styles.createBtn}
          onPress={() => router.push('/(drawer)/(tabs)/new-survey')}
        >
          <Text style={styles.createBtnText}>Create New Survey</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="History" />

      {/* Sticky Filtering Section */}
      <View style={[styles.filterHeader, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderBottomColor: isDark ? '#334155' : '#e5e7eb' }]}>
        {/* Search Input Bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
          <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#f1f5f9' : '#1e293b' }]}
            value={searchQuery}
            placeholder="Search by site or client..."
            placeholderTextColor="#94a3b8"
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          ) : null}
        </View>

        {/* Priority Filters horizontal scroll */}
        <View style={styles.chipsRow}>
          {(['All', 'High', 'Medium', 'Low'] as const).map((priorityOption) => {
            const isSelected = selectedPriority === priorityOption;
            const chipColor = 
              priorityOption === 'High' ? '#ef4444' :
              priorityOption === 'Medium' ? '#d97706' :
              priorityOption === 'Low' ? '#10b981' : '#6d28d9';

            return (
              <Pressable
                key={priorityOption}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? chipColor : isDark ? '#0f172a' : '#f1f5f9',
                    borderColor: isSelected ? 'transparent' : isDark ? '#334155' : '#e5e7eb',
                  },
                ]}
                onPress={() => setSelectedPriority(priorityOption)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected ? '#ffffff' : isDark ? '#94a3b8' : '#64748b',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {priorityOption}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* FlatList rendering surveys history */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  filterHeader: {
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchBar: {
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  surveyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '800',
  },
  clientName: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  attachmentsRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 16,
  },
  attachmentIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(109, 40, 217, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    borderRadius: 20,
    padding: 32,
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    maxWidth: 240,
    lineHeight: 20,
  },
  createBtn: {
    backgroundColor: '#6d28d9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
