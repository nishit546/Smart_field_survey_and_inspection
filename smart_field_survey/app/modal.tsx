import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys, Survey } from '../context/SurveyContext';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ModalScreen() {
  const { tempSurvey, surveys, submitTempSurvey, loadSurveyToEdit, deleteSurvey } = useSurveys();
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  // Check if previewing a draft or viewing a saved survey
  const isPreview = params.isPreview === 'true';
  const surveyId = params.id as string;

  // Retrieve survey record
  let survey: Partial<Survey> | undefined;
  if (isPreview) {
    survey = tempSurvey;
  } else {
    survey = surveys.find((s) => s.id === surveyId);
  }

  // Handle case where survey is not found
  if (!survey) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={[styles.errorTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Record Not Found</Text>
        <Text style={styles.errorDesc}>The selected survey could not be retrieved.</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Generate initials for contact avatar
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Submit survey action
  const handleSubmit = () => {
    const savedSurvey = submitTempSurvey();
    if (savedSurvey) {
      Alert.alert(
        'Survey Submitted',
        'Your field inspection survey has been successfully saved to history.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Redirect to History tab
              router.push('/(drawer)/(tabs)/history');
            },
          },
        ]
      );
    } else {
      Alert.alert('Submission Error', 'Failed to submit. Please ensure all required fields are filled out.');
    }
  };

  // Edit survey action
  const handleEdit = () => {
    if (!isPreview && survey) {
      loadSurveyToEdit(survey as Survey);
    }
    // Dismiss modal and navigate to New Survey form
    router.back();
    router.push('/(drawer)/(tabs)/new-survey');
  };

  // Delete survey action with confirmation
  const handleDelete = () => {
    if (isPreview) return;
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to permanently delete this survey from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(surveyId);
            router.back();
            Alert.alert('Survey Deleted', 'The inspection record has been removed.');
          },
        },
      ]
    );
  };

  const priorityColor = 
    survey.priority === 'High' ? '#ef4444' :
    survey.priority === 'Medium' ? '#d97706' : '#10b981';

  const priorityBg = 
    survey.priority === 'High' ? '#fee2e2' :
    survey.priority === 'Medium' ? '#fef3c7' : '#d1fae5';

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc', paddingBottom: insets.bottom }]}>
      
      {/* Top Modal Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#334155' : '#e5e7eb' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
          {isPreview ? 'Survey Preview' : 'Survey Details'}
        </Text>
        <Pressable style={styles.closeHeaderBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={isDark ? '#cbd5e1' : '#475569'} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Site Header Details */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.siteHeaderRow}>
            <Text style={[styles.siteName, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              {survey.siteName || 'No Site Name Provided'}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {survey.priority || 'Medium'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.clientName}>{survey.clientName || 'No Client Name'}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>{survey.date || 'No Date'}</Text>
            </View>
            {!isPreview && (
              <View style={styles.metaItem}>
                <Ionicons name="finger-print" size={14} color="#64748b" />
                <Text style={[styles.metaText, { fontFamily: 'monospace' }]}>{surveyId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Scope / Description Block */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Inspection Scope</Text>
          <Text style={[styles.descriptionText, { color: isDark ? '#cbd5e1' : '#334155' }]}>
            {survey.description || 'No description provided.'}
          </Text>
        </View>

        {/* Camera Photo Attachment */}
        {survey.photoUri ? (
          <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Evidence Capture</Text>
            <Image source={{ uri: survey.photoUri }} style={styles.capturedImage} resizeMode="cover" />
            <View style={styles.photoTimestamp}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={styles.timestampText}>Captured at {survey.photoCaptureTime || 'unknown time'}</Text>
            </View>
          </View>
        ) : null}

        {/* GPS Geolocation details */}
        {survey.latitude !== undefined && survey.longitude !== undefined ? (
          <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>GPS Geolocation</Text>
            <View style={styles.coordGrid}>
              <View style={styles.coordCell}>
                <Ionicons name="compass-outline" size={18} color="#6d28d9" />
                <View>
                  <Text style={styles.coordCellLabel}>Latitude</Text>
                  <Text style={[styles.coordCellValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    {survey.latitude.toFixed(6)}°
                  </Text>
                </View>
              </View>
              <View style={styles.coordCell}>
                <Ionicons name="compass-outline" size={18} color="#6d28d9" />
                <View>
                  <Text style={styles.coordCellLabel}>Longitude</Text>
                  <Text style={[styles.coordCellValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    {survey.longitude.toFixed(6)}°
                  </Text>
                </View>
              </View>
            </View>
            {survey.locationAccuracy !== undefined ? (
              <View style={styles.accuracyFooter}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#10b981" />
                <Text style={styles.accuracyText}>Accuracy margin: ± {survey.locationAccuracy.toFixed(1)}m</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Client Contact Info */}
        {survey.contactName ? (
          <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Client Contact Representative</Text>
            <View style={styles.contactPanel}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>{getInitials(survey.contactName)}</Text>
              </View>
              <View style={styles.contactDetails}>
                <Text style={[styles.contactNameText, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                  {survey.contactName}
                </Text>
                <Text style={styles.contactPhoneText}>
                  {survey.contactNumber || 'No phone number available'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Clipboard Notes Card */}
        {survey.notes ? (
          <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Inspection Field Notes</Text>
            <View style={[styles.notesContainer, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: isDark ? '#334155' : '#e5e7eb' }]}>
              <Text style={[styles.notesText, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                {survey.notes}
              </Text>
            </View>
          </View>
        ) : null}

      </ScrollView>

      {/* Footer Actions Panel */}
      <View style={[styles.footerActions, { borderTopColor: isDark ? '#334155' : '#e5e7eb', backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
        {isPreview ? (
          <>
            <Pressable style={styles.editBtn} onPress={handleEdit}>
              <Text style={styles.editBtnText}>Edit Survey</Text>
            </Pressable>
            <Pressable style={[styles.submitBtn, { backgroundColor: '#10b981' }]} onPress={handleSubmit}>
              <Ionicons name="send" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Submit Survey</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" style={{ marginRight: 6 }} />
              <Text style={styles.deleteBtnText}>Delete Record</Text>
            </Pressable>
            <Pressable style={[styles.submitBtn, { backgroundColor: '#6d28d9' }]} onPress={handleEdit}>
              <Ionicons name="create-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Edit Survey</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 24,
  },
  closeBtn: {
    backgroundColor: '#6d28d9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeHeaderBtn: {
    padding: 4,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  siteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  siteName: {
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
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
  clientName: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#94a3b8',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  capturedImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 4,
  },
  photoTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  timestampText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  coordGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  coordCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(109, 40, 217, 0.05)',
  },
  coordCellLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  coordCellValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  accuracyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  contactPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6d28d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactDetails: {
    flex: 1,
  },
  contactNameText: {
    fontSize: 14,
    fontWeight: '700',
  },
  contactPhoneText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  notesContainer: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 2,
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
});
