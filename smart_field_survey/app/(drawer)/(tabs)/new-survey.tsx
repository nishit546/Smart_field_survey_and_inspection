import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys } from '../../../context/SurveyContext';
import CustomHeader from '../../../components/CustomHeader';
import { useColorScheme } from '../../../hooks/use-color-scheme';

export default function NewSurveyScreen() {
  const { tempSurvey, updateTempSurvey, clearTempSurvey } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  // Local state for validation errors
  const [errors, setErrors] = useState<{
    siteName?: string;
    clientName?: string;
    description?: string;
    date?: string;
  }>({});

  // Sync local inputs with global context or default values
  const [siteName, setSiteName] = useState(tempSurvey.siteName || '');
  const [clientName, setClientName] = useState(tempSurvey.clientName || '');
  const [description, setDescription] = useState(tempSurvey.description || '');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(tempSurvey.priority || 'Medium');
  const [date, setDate] = useState(tempSurvey.date || new Date().toISOString().split('T')[0]);

  // Sync inputs if global tempSurvey changes (e.g. when cleared or loaded)
  useEffect(() => {
    setSiteName(tempSurvey.siteName || '');
    setClientName(tempSurvey.clientName || '');
    setDescription(tempSurvey.description || '');
    setPriority(tempSurvey.priority || 'Medium');
    setDate(tempSurvey.date || new Date().toISOString().split('T')[0]);
  }, [tempSurvey]);

  // Handle priorities changes
  const handlePrioritySelect = (selected: 'Low' | 'Medium' | 'High') => {
    setPriority(selected);
    updateTempSurvey({ priority: selected });
  };

  // Validate fields in real-time on blur or value change
  const validateField = (field: 'siteName' | 'clientName' | 'description' | 'date', value: string) => {
    let newErrors = { ...errors };
    if (field === 'date') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!value) {
        newErrors.date = 'Date is required';
      } else if (!dateRegex.test(value)) {
        newErrors.date = 'Format must be YYYY-MM-DD';
      } else {
        delete newErrors.date;
      }
    } else {
      if (!value.trim()) {
        newErrors[field] = `${field === 'siteName' ? 'Site name' : field === 'clientName' ? 'Client name' : 'Description'} is required`;
      } else {
        delete newErrors[field];
      }
    }
    setErrors(newErrors);
  };

  const handleTextChange = (field: 'siteName' | 'clientName' | 'description' | 'date', text: string) => {
    if (field === 'siteName') setSiteName(text);
    if (field === 'clientName') setClientName(text);
    if (field === 'description') setDescription(text);
    if (field === 'date') setDate(text);

    // Update global state immediately
    updateTempSurvey({ [field]: text });
    
    // Clear validation error if typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Check form validity before proceeding
  const handlePreview = () => {
    const newErrors: typeof errors = {};
    if (!siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
      newErrors.date = 'Date is required';
    } else if (!dateRegex.test(date)) {
      newErrors.date = 'Format must be YYYY-MM-DD';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please correct the highlighted fields before previewing.');
      return;
    }

    // Save final changes to global state
    updateTempSurvey({
      siteName,
      clientName,
      description,
      priority,
      date,
    });

    // Navigate to Survey Preview Modal
    router.push({ pathname: '/modal', params: { isPreview: 'true' } });
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Form',
      'Are you sure you want to clear all fields and attachments?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            clearTempSurvey();
            setErrors({});
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="New Survey" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Form Container */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Site & Client Details</Text>

          {/* Site Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Site Name *</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                  borderColor: errors.siteName ? '#ef4444' : isDark ? '#334155' : '#cbd5e1',
                },
              ]}
              value={siteName}
              placeholder="e.g. Hydroelectric Dam Section A"
              placeholderTextColor="#94a3b8"
              onChangeText={(text) => handleTextChange('siteName', text)}
              onBlur={() => validateField('siteName', siteName)}
            />
            {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
          </View>

          {/* Client Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Client Name *</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                  borderColor: errors.clientName ? '#ef4444' : isDark ? '#334155' : '#cbd5e1',
                },
              ]}
              value={clientName}
              placeholder="e.g. Apex Utilities Ltd"
              placeholderTextColor="#94a3b8"
              onChangeText={(text) => handleTextChange('clientName', text)}
              onBlur={() => validateField('clientName', clientName)}
            />
            {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Description *</Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                {
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                  borderColor: errors.description ? '#ef4444' : isDark ? '#334155' : '#cbd5e1',
                },
              ]}
              value={description}
              placeholder="Describe the scope, objectives, or instructions for this inspection..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              onChangeText={(text) => handleTextChange('description', text)}
              onBlur={() => validateField('description', description)}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Priority Picker */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Priority</Text>
            <View style={styles.prioritySelector}>
              {(['Low', 'Medium', 'High'] as const).map((p) => {
                const isSelected = priority === p;
                const activeBg = p === 'High' ? '#fee2e2' : p === 'Medium' ? '#fef3c7' : '#d1fae5';
                const activeText = p === 'High' ? '#ef4444' : p === 'Medium' ? '#d97706' : '#10b981';
                
                return (
                  <Pressable
                    key={p}
                    style={[
                      styles.priorityButton,
                      {
                        backgroundColor: isSelected ? activeBg : isDark ? '#0f172a' : '#f1f5f9',
                        borderColor: isSelected ? activeText : 'transparent',
                      },
                    ]}
                    onPress={() => handlePrioritySelect(p)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        {
                          color: isSelected ? activeText : isDark ? '#94a3b8' : '#64748b',
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Date Picker Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Survey Date *</Text>
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    flex: 1,
                    backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                    borderColor: errors.date ? '#ef4444' : isDark ? '#334155' : '#cbd5e1',
                  },
                ]}
                value={date}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                onChangeText={(text) => handleTextChange('date', text)}
                onBlur={() => validateField('date', date)}
              />
              <Pressable 
                style={[styles.todayButton, { backgroundColor: '#6d28d9' }]}
                onPress={() => handleTextChange('date', new Date().toISOString().split('T')[0])}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </Pressable>
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>
        </View>

        {/* Attachment Status Section */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Survey Attachments</Text>
          <Text style={styles.cardSubtitle}>Link required hardware metrics and contacts to this survey.</Text>

          <View style={styles.attachmentList}>
            {/* Camera Photo */}
            <View style={[styles.attachmentItem, { borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}>
              <View style={styles.attachmentMeta}>
                <Ionicons
                  name={tempSurvey.photoUri ? 'checkmark-circle' : 'camera-outline'}
                  size={24}
                  color={tempSurvey.photoUri ? '#10b981' : '#94a3b8'}
                />
                <View>
                  <Text style={[styles.attachmentLabel, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    Photo Capture
                  </Text>
                  <Text style={styles.attachmentValue}>
                    {tempSurvey.photoUri ? `Captured at ${tempSurvey.photoCaptureTime || 'unknown time'}` : 'No photo linked'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={[styles.attachButton, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}
                onPress={() => router.push('/(drawer)/camera')}
              >
                <Text style={[styles.attachButtonText, { color: '#6d28d9' }]}>
                  {tempSurvey.photoUri ? 'Retake' : 'Open'}
                </Text>
              </Pressable>
            </View>

            {/* GPS Location */}
            <View style={[styles.attachmentItem, { borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}>
              <View style={styles.attachmentMeta}>
                <Ionicons
                  name={tempSurvey.latitude ? 'checkmark-circle' : 'location-outline'}
                  size={24}
                  color={tempSurvey.latitude ? '#10b981' : '#94a3b8'}
                />
                <View>
                  <Text style={[styles.attachmentLabel, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    GPS Coordinates
                  </Text>
                  <Text style={styles.attachmentValue} numberOfLines={1}>
                    {tempSurvey.latitude
                      ? `Lat: ${tempSurvey.latitude.toFixed(4)}, Lng: ${tempSurvey.longitude?.toFixed(4)}`
                      : 'No location coordinates linked'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={[styles.attachButton, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}
                onPress={() => router.push('/(drawer)/location')}
              >
                <Text style={[styles.attachButtonText, { color: '#6d28d9' }]}>
                  {tempSurvey.latitude ? 'Refresh' : 'Get'}
                </Text>
              </Pressable>
            </View>

            {/* Client Contact */}
            <View style={[styles.attachmentItem, { borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}>
              <View style={styles.attachmentMeta}>
                <Ionicons
                  name={tempSurvey.contactName ? 'checkmark-circle' : 'person-outline'}
                  size={24}
                  color={tempSurvey.contactName ? '#10b981' : '#94a3b8'}
                />
                <View>
                  <Text style={[styles.attachmentLabel, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    Client Contact
                  </Text>
                  <Text style={styles.attachmentValue} numberOfLines={1}>
                    {tempSurvey.contactName
                      ? `${tempSurvey.contactName} (${tempSurvey.contactNumber || 'No number'})`
                      : 'No contact selected'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={[styles.attachButton, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}
                onPress={() => router.push('/(drawer)/contacts')}
              >
                <Text style={[styles.attachButtonText, { color: '#6d28d9' }]}>
                  {tempSurvey.contactName ? 'Change' : 'Select'}
                </Text>
              </Pressable>
            </View>

            {/* Clipboard Notes */}
            <View style={styles.attachmentItem}>
              <View style={styles.attachmentMeta}>
                <Ionicons
                  name={tempSurvey.notes ? 'checkmark-circle' : 'clipboard-outline'}
                  size={24}
                  color={tempSurvey.notes ? '#10b981' : '#94a3b8'}
                />
                <View>
                  <Text style={[styles.attachmentLabel, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    Clipboard Notes
                  </Text>
                  <Text style={styles.attachmentValue} numberOfLines={1}>
                    {tempSurvey.notes ? tempSurvey.notes : 'No extra notes pasted'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={[styles.attachButton, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}
                onPress={() => router.push('/(drawer)/clipboard')}
              >
                <Text style={[styles.attachButtonText, { color: '#6d28d9' }]}>
                  {tempSurvey.notes ? 'Modify' : 'Paste'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Reset Form</Text>
          </Pressable>
          <Pressable style={styles.previewBtn} onPress={handlePreview}>
            <Text style={styles.previewBtnText}>Preview & Submit</Text>
            <Ionicons name="arrow-forward-outline" size={16} color="#ffffff" style={styles.btnIcon} />
          </Pressable>
        </View>
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
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: -12,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 13,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  todayButton: {
    width: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  attachmentList: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  attachmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  attachmentLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  attachmentValue: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 1,
    maxWidth: 170,
  },
  attachButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  attachButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#94a3b8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '700',
  },
  previewBtn: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#6d28d9',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  btnIcon: {
    marginLeft: 6,
  },
});
