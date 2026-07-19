import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys } from '../../context/SurveyContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import CustomHeader from '../../components/CustomHeader';

interface ContactItem {
  id: string;
  name: string;
  phoneNumber?: string;
}

// Fallback Mock Contacts list for simulator environments
const MOCK_CONTACTS: ContactItem[] = [
  { id: 'mock-1', name: 'Alice Smith', phoneNumber: '+1 (555) 019-2834' },
  { id: 'mock-2', name: 'Bob Vance', phoneNumber: '+1 (555) 014-9988' },
  { id: 'mock-3', name: 'Charlie Green', phoneNumber: '+1 (555) 012-7744' },
  { id: 'mock-4', name: 'Diana Prince' }, // No Number test case
  { id: 'mock-5', name: 'Evan Wright', phoneNumber: '+1 (555) 018-3366' },
  { id: 'mock-6', name: 'Fiona Gallagher', phoneNumber: '+1 (555) 011-5522' },
  { id: 'mock-7', name: 'George Miller', phoneNumber: '+1 (555) 016-1199' },
];

export default function ContactsScreen() {
  const { tempSurvey, updateTempSurvey } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State variables
  const [permissionStatus, setPermissionStatus] = useState<Contacts.PermissionStatus | null>(null);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load permissions and fetch contacts on mount
  useEffect(() => {
    checkPermissionAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPermissionAndFetch = async () => {
    try {
      setIsLoading(true);
      const { status } = await Contacts.getPermissionsAsync();
      setPermissionStatus(status);

      if (status === Contacts.PermissionStatus.GRANTED) {
        await loadContacts();
      } else {
        // Automatically ask for permission if not checked yet
        const { status: requestStatus } = await Contacts.requestPermissionsAsync();
        setPermissionStatus(requestStatus);
        if (requestStatus === Contacts.PermissionStatus.GRANTED) {
          await loadContacts();
        } else {
          // If denied, use mock data as fallback for testing
          setContacts(MOCK_CONTACTS);
        }
      }
    } catch (error) {
      console.error('Error checking contacts permissions:', error);
      setContacts(MOCK_CONTACTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionStatus(status);
      if (status === Contacts.PermissionStatus.GRANTED) {
        setIsLoading(true);
        await loadContacts();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error requesting contacts permissions:', error);
      Alert.alert('Permission Error', 'Failed to request contacts permissions.');
    }
  };

  // Fetch device contacts
  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data && data.length > 0) {
        const formattedContacts: ContactItem[] = data.map((c) => ({
          id: c.id || `contact-${Math.random()}`,
          name: c.name || 'Unnamed Contact',
          phoneNumber: c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : undefined,
        }));
        // Sort contacts alphabetically
        formattedContacts.sort((a, b) => a.name.localeCompare(b.name));
        setContacts(formattedContacts);
      } else {
        setContacts(MOCK_CONTACTS);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts(MOCK_CONTACTS);
    }
  };

  // Pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (permissionStatus === Contacts.PermissionStatus.GRANTED) {
      await loadContacts();
    } else {
      // Simulate reload delay for mock data
      await new Promise((resolve) => setTimeout(resolve, 800));
      setContacts(MOCK_CONTACTS);
    }
    setIsRefreshing(false);
  };

  // Copy number to clipboard
  const handleCopyNumber = async (number: string, name: string) => {
    try {
      await Clipboard.setStringAsync(number);
      Alert.alert(
        'Number Copied',
        `Phone number for ${name} has been copied to your clipboard.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error copying number:', error);
      Alert.alert('Copy Failed', 'Could not copy phone number.');
    }
  };

  // Select contact for survey
  const handleSelectContact = (contact: ContactItem) => {
    updateTempSurvey({
      contactName: contact.name,
      contactNumber: contact.phoneNumber || 'No Number',
    });
    router.push('/(drawer)/(tabs)/new-survey');
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(query);
    const phoneMatch = c.phoneNumber?.toLowerCase().includes(query) || false;
    return nameMatch || phoneMatch;
  });

  // Render Single Contact Item
  const renderItem = ({ item }: { item: ContactItem }) => {
    const isSelected = tempSurvey.contactName === item.name;
    const initial = getInitials(item.name);

    return (
      <View style={[
        styles.contactRow, 
        { 
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderBottomColor: isDark ? '#334155' : '#f1f5f9',
          borderColor: isSelected ? '#0a7ea4' : 'transparent',
          borderWidth: isSelected ? 1 : 0
        }
      ]}>
        <Pressable style={styles.contactPressable} onPress={() => handleSelectContact(item)}>
          <View style={[styles.avatar, { backgroundColor: isSelected ? '#0a7ea4' : '#e2e8f0' }]}>
            <Text style={[styles.avatarText, { color: isSelected ? '#ffffff' : '#475569' }]}>{initial}</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={[styles.contactName, { color: isDark ? '#f1f5f9' : '#1e293b' }]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.phoneNumber ? (
              <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
            ) : (
              <Text style={styles.noNumberText}>No Number</Text>
            )}
          </View>
        </Pressable>

        {item.phoneNumber && (
          <Pressable 
            style={styles.copyButton}
            onPress={() => handleCopyNumber(item.phoneNumber!, item.name)}
          >
            <Ionicons name="clipboard-outline" size={18} color="#0a7ea4" />
          </Pressable>
        )}
      </View>
    );
  };

  // Empty List Component
  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={64} color="#94a3b8" />
        <Text style={[styles.emptyTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>No Contacts Found</Text>
        <Text style={styles.emptyDesc}>
          {searchQuery ? "No matches for your search term." : "No contacts available on this device."}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="Select Client" />

      {/* Sticky Header with Search Input & Counter */}
      <View style={[styles.searchHeader, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderBottomColor: isDark ? '#334155' : '#e5e7eb' }]}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#f1f5f9' : '#1e293b' }]}
            value={searchQuery}
            placeholder="Search clients by name or phone..."
            placeholderTextColor="#94a3b8"
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.counterText}>
            Showing {filteredContacts.length} of {contacts.length} clients
          </Text>
          {permissionStatus !== Contacts.PermissionStatus.GRANTED && (
            <Text style={styles.mockBadge}>Running Sandbox Mode</Text>
          )}
        </View>
      </View>

      {/* Renders Loader */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>Fetching clients...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#0a7ea4"
              colors={['#0a7ea4']}
            />
          }
        />
      )}

      {/* Permissions Helper Alert if denied */}
      {permissionStatus !== null && permissionStatus !== Contacts.PermissionStatus.GRANTED && (
        <View style={[styles.warningBanner, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
          <Ionicons name="warning" size={18} color="#d97706" />
          <Text style={[styles.warningText, { color: isDark ? '#fef3c7' : '#92400e' }]}>
            Permission denied. Using sandbox contacts.
          </Text>
          <Pressable onPress={handleRequestPermission} style={styles.enableLink}>
            <Text style={styles.enableLinkText}>Enable</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  searchHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    height: 48,
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
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  counterText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  mockBadge: {
    fontSize: 10,
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  contactPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  contactDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
  },
  contactPhone: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  noNumberText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 240,
    lineHeight: 18,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  enableLink: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#d97706',
  },
  enableLinkText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
