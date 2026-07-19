import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys } from '../../context/SurveyContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import CustomHeader from '../../components/CustomHeader';

export default function ClipboardScreen() {
  const { tempSurvey, updateTempSurvey, editingSurveyId } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Constants
  const surveyId = editingSurveyId || 'SURVEY-DRAFT-TEMP';
  const contactNumber = tempSurvey.contactNumber || '';
  const coordinates = tempSurvey.latitude && tempSurvey.longitude
    ? `${tempSurvey.latitude.toFixed(6)}, ${tempSurvey.longitude.toFixed(6)}`
    : '';

  // Local state for the editable notes
  const [notes, setNotes] = useState(tempSurvey.notes || '');

  // Keep local state in sync with context
  useEffect(() => {
    setNotes(tempSurvey.notes || '');
  }, [tempSurvey.notes]);

  // Copy Action helper
  const handleCopyText = async (text: string, label: string) => {
    if (!text) {
      Alert.alert('Copy Error', `No ${label} data is currently available to copy.`);
      return;
    }

    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied successfully', `${label} has been copied to the system clipboard.`);
    } catch (error) {
      console.error('Error copying text:', error);
      Alert.alert('Copy Failed', `Failed to copy ${label} to clipboard.`);
    }
  };

  // Paste from clipboard into Notes
  const handlePasteNotes = async () => {
    try {
      const clipboardText = await Clipboard.getStringAsync();
      
      if (!clipboardText) {
        Alert.alert('Paste Info', 'The clipboard is empty or does not contain plain text.');
        return;
      }

      // Append or replace notes
      const updatedNotes = notes ? `${notes}\n${clipboardText}` : clipboardText;
      setNotes(updatedNotes);
      updateTempSurvey({ notes: updatedNotes });
      
      Alert.alert('Text Pasted', 'Clipboard text was successfully pasted into your survey notes.');
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
      Alert.alert('Paste Failed', 'Could not read text from system clipboard.');
    }
  };

  // Clear system clipboard
  const handleClearClipboard = async () => {
    try {
      await Clipboard.setStringAsync('');
      Alert.alert('Clipboard Cleared', 'System clipboard data has been successfully cleared.');
    } catch (error) {
      console.error('Error clearing clipboard:', error);
      Alert.alert('Clear Failed', 'Could not clear system clipboard.');
    }
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
    updateTempSurvey({ notes: text });
  };

  const handleSaveAndExit = () => {
    router.push('/(drawer)/(tabs)/new-survey');
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="Clipboard Actions" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Copy Sections Card */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Copy Survey Parameters</Text>
          <Text style={styles.cardSubtitle}>Tap the copy icons to write survey metrics to the system clipboard.</Text>

          <View style={styles.parameterList}>
            {/* Copy Survey ID */}
            <View style={[styles.paramRow, { borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}>
              <View style={styles.paramMeta}>
                <Text style={styles.paramLabel}>Survey ID</Text>
                <Text style={[styles.paramValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>{surveyId}</Text>
              </View>
              <Pressable
                style={styles.actionIconBtn}
                onPress={() => handleCopyText(surveyId, 'Survey ID')}
              >
                <Ionicons name="copy-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>

            {/* Copy Contact Number */}
            <View style={[styles.paramRow, { borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}>
              <View style={styles.paramMeta}>
                <Text style={styles.paramLabel}>Contact Number</Text>
                <Text style={[styles.paramValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                  {contactNumber || 'No Contact Linked'}
                </Text>
              </View>
              <Pressable
                style={[styles.actionIconBtn, { opacity: contactNumber ? 1 : 0.4 }]}
                disabled={!contactNumber}
                onPress={() => handleCopyText(contactNumber, 'Contact Number')}
              >
                <Ionicons name="copy-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>

            {/* Copy Current Location */}
            <View style={styles.paramRow}>
              <View style={styles.paramMeta}>
                <Text style={styles.paramLabel}>GPS Location</Text>
                <Text style={[styles.paramValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                  {coordinates || 'No Location Linked'}
                </Text>
              </View>
              <Pressable
                style={[styles.actionIconBtn, { opacity: coordinates ? 1 : 0.4 }]}
                disabled={!coordinates}
                onPress={() => handleCopyText(coordinates, 'GPS Coordinates')}
              >
                <Ionicons name="copy-outline" size={20} color="#0a7ea4" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Survey Notes & Paste Card */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Survey Inspection Notes</Text>
          <Text style={styles.cardSubtitle}>Paste or type extra compliance notes relating to this inspection.</Text>

          <TextInput
            style={[
              styles.notesInput,
              {
                backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                color: isDark ? '#f1f5f9' : '#1e293b',
                borderColor: isDark ? '#334155' : '#cbd5e1',
              },
            ]}
            value={notes}
            placeholder="No notes compiled yet. Use clipboard paste or write manually..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={6}
            onChangeText={handleNotesChange}
          />

          <View style={styles.utilityBtnsContainer}>
            <Pressable style={[styles.utilBtn, styles.clearBtn]} onPress={() => handleNotesChange('')}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text style={styles.clearBtnText}>Wipe Notes</Text>
            </Pressable>

            <Pressable style={[styles.utilBtn, styles.pasteBtn]} onPress={handlePasteNotes}>
              <Ionicons name="clipboard-outline" size={16} color="#ffffff" />
              <Text style={styles.pasteBtnText}>Paste Notes</Text>
            </Pressable>
          </View>
        </View>

        {/* Clipboard Administration Card */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>Clipboard Administration</Text>
          <Text style={styles.cardSubtitle}>Manage local system clipboard records.</Text>
          
          <Pressable 
            style={[styles.adminBtn, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}
            onPress={handleClearClipboard}
          >
            <Ionicons name="shield-outline" size={20} color="#ef4444" />
            <Text style={styles.adminBtnText}>Clear System Clipboard Data</Text>
          </Pressable>
        </View>

        {/* Save and Close Button */}
        <Pressable 
          style={[styles.saveBtn, { backgroundColor: '#10b981' }]} 
          onPress={handleSaveAndExit}
        >
          <Text style={styles.saveBtnText}>Save Notes & Exit</Text>
          <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
        </Pressable>

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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  parameterList: {
    marginTop: 4,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  paramMeta: {
    flex: 1,
    gap: 4,
  },
  paramLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  paramValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  notesInput: {
    height: 120,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  utilityBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  utilBtn: {
    flexDirection: 'row',
    height: 38,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  clearBtn: {
    borderWidth: 1.5,
    borderColor: '#ef4444',
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  pasteBtn: {
    backgroundColor: '#0a7ea4',
  },
  pasteBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  adminBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  adminBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
