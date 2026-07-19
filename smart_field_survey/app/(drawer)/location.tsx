import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator, Alert, Linking, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys } from '../../context/SurveyContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import CustomHeader from '../../components/CustomHeader';

export default function LocationScreen() {
  const { tempSurvey, updateTempSurvey } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State variables
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | undefined>(tempSurvey.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(tempSurvey.longitude);
  const [accuracy, setAccuracy] = useState<number | undefined>(tempSurvey.locationAccuracy);

  // Request/Check permissions on mount
  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === Location.PermissionStatus.GRANTED) {
        // If already granted, fetch location automatically if not already set
        if (latitude === undefined || longitude === undefined) {
          fetchLocation();
        }
      }
    } catch (error) {
      console.error('Error checking location permissions:', error);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status === Location.PermissionStatus.GRANTED) {
        fetchLocation();
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      Alert.alert('Permission Error', 'Failed to request location permissions.');
    }
  };

  // Fetch current GPS coordinates
  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      // Request position with high accuracy
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude: lat, longitude: lng, accuracy: acc } = currentPosition.coords;

      setLatitude(lat);
      setLongitude(lng);
      setAccuracy(acc ?? undefined);

      // Save to global SurveyContext
      updateTempSurvey({
        latitude: lat,
        longitude: lng,
        locationAccuracy: acc ?? undefined,
      });
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert(
        'GPS Lock Error',
        'Could not obtain a GPS signal. Please check if location services are enabled on your device.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copy current location to clipboard
  const handleCopyLocation = async () => {
    if (latitude === undefined || longitude === undefined) {
      Alert.alert('Copy Error', 'No location data available to copy.');
      return;
    }

    const formattedCoordinates = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)} (Accuracy: ${accuracy ? accuracy.toFixed(1) : 'N/A'}m)`;
    
    try {
      await Clipboard.setStringAsync(formattedCoordinates);
      Alert.alert(
        'Location Copied',
        'The GPS coordinates have been successfully copied to your clipboard.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Copy Failed', 'Could not copy coordinates to clipboard.');
    }
  };

  // Safe and exit
  const handleSaveAndExit = () => {
    router.push('/(drawer)/(tabs)/new-survey');
  };

  const isGranted = permissionStatus === Location.PermissionStatus.GRANTED;

  return (
    <View style={[styles.mainContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
      <CustomHeader title="GPS Location" />

      {/* Renders permissions checking loader */}
      {permissionStatus === null && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>Checking location permission status...</Text>
        </View>
      )}

      {/* Renders if permissions are denied */}
      {permissionStatus !== null && !isGranted && (
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <Ionicons name="location-outline" size={64} color="#0a7ea4" style={{ alignSelf: 'center' }} />
            <Text style={[styles.permissionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              Location Access Required
            </Text>
            <Text style={styles.permissionDesc}>
              {"We need permission to access your device's location to automatically log site coordinates for your field survey."}
            </Text>
            
            <Pressable 
              style={[styles.primaryBtn, { backgroundColor: '#0a7ea4' }]}
              onPress={handleRequestPermission}
            >
              <Text style={styles.primaryBtnText}>Grant Permission</Text>
            </Pressable>

            {permissionStatus === Location.PermissionStatus.DENIED && (
              <Pressable 
                style={styles.secondaryBtn}
                onPress={() => Linking.openSettings()}
              >
                <Text style={styles.secondaryBtnText}>Open System Settings</Text>
              </Pressable>
            )}

            <Pressable 
              style={styles.backBtn}
              onPress={handleSaveAndExit}
            >
              <Text style={styles.backBtnText}>Go Back to Survey</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Renders main location content if permission granted */}
      {permissionStatus !== null && isGranted && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Coordinates Details Card */}
          <View style={[styles.detailsCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.detailsHeader}>
              <View style={styles.gpsPulseContainer}>
                <View style={[styles.gpsPulseDot, { backgroundColor: isLoading ? '#f59e0b' : '#10b981' }]} />
              </View>
              <Text style={[styles.statusText, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                {isLoading ? 'Fetching Satellite GPS...' : 'GPS Lock Successful'}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Latitude Display */}
            <View style={styles.coordinateRow}>
              <View style={styles.coordLabelContainer}>
                <Ionicons name="compass-outline" size={20} color="#0a7ea4" />
                <Text style={styles.coordLabel}>Latitude</Text>
              </View>
              <Text style={[styles.coordValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                {latitude !== undefined ? `${latitude.toFixed(6)}°` : '--'}
              </Text>
            </View>

            {/* Longitude Display */}
            <View style={styles.coordinateRow}>
              <View style={styles.coordLabelContainer}>
                <Ionicons name="compass" size={20} color="#0a7ea4" />
                <Text style={styles.coordLabel}>Longitude</Text>
              </View>
              <Text style={[styles.coordValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                {longitude !== undefined ? `${longitude.toFixed(6)}°` : '--'}
              </Text>
            </View>

            {/* Accuracy Display */}
            <View style={styles.coordinateRow}>
              <View style={styles.coordLabelContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#0a7ea4" />
                <Text style={styles.coordLabel}>Accuracy</Text>
              </View>
              <Text style={[styles.coordValue, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                {accuracy !== undefined ? `± ${accuracy.toFixed(1)} meters` : '--'}
              </Text>
            </View>
          </View>

          {/* Aesthetic GPS Compass Art */}
          <View style={styles.compassContainer}>
            <View style={[styles.compassOuterCircle, { borderColor: isDark ? '#334155' : '#cbd5e1' }]}>
              <Ionicons name="navigate-outline" size={96} color="#0a7ea4" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
            <Text style={styles.compassText}>GPS Geolocation Sensor Active</Text>
          </View>

          {/* Actions Button Panel */}
          <View style={styles.actionPanel}>
            <Pressable 
              style={[styles.actionBtn, styles.refreshBtn, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]} 
              onPress={fetchLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#0a7ea4" />
              ) : (
                <>
                  <Ionicons name="refresh" size={18} color="#0a7ea4" />
                  <Text style={styles.refreshBtnText}>Refresh Location</Text>
                </>
              )}
            </Pressable>

            <Pressable 
              style={[styles.actionBtn, styles.copyBtn, { backgroundColor: '#0a7ea4' }]} 
              onPress={handleCopyLocation}
              disabled={latitude === undefined}
            >
              <Ionicons name="clipboard-outline" size={18} color="#ffffff" />
              <Text style={styles.copyBtnText}>Copy Coordinates</Text>
            </Pressable>
          </View>

          {/* Save Button */}
          <Pressable 
            style={[styles.saveBtn, { backgroundColor: '#10b981' }]} 
            onPress={handleSaveAndExit}
          >
            <Text style={styles.saveBtnText}>Save Coordinates & Exit</Text>
            <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
          </Pressable>
        </ScrollView>
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
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    backgroundColor: 'transparent',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    marginTop: 12,
  },
  secondaryBtnText: {
    color: '#0a7ea4',
    fontSize: 15,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 20,
    padding: 8,
    alignSelf: 'center',
  },
  backBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  gpsPulseContainer: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coordLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coordLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  coordValue: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  compassContainer: {
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  compassOuterCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  compassText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  actionPanel: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
  },
  refreshBtnText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '700',
  },
  copyBtn: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  copyBtnText: {
    color: '#ffffff',
    fontSize: 14,
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
