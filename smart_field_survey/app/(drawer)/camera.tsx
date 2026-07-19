import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator, Alert, Linking, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurveys } from '../../context/SurveyContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CameraScreen() {
  const { tempSurvey, updateTempSurvey } = useSurveys();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const cameraRef = useRef<CameraView>(null);
  
  // Camera permission hook
  const [permission, requestPermission] = useCameraPermissions();
  
  // State variables
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Local state copy for previewing and modifying
  const [localPhotoUri, setLocalPhotoUri] = useState<string | undefined>(tempSurvey.photoUri);
  const [localCaptureTime, setLocalCaptureTime] = useState<string | undefined>(tempSurvey.photoCaptureTime);

  // If permission is still loading
  if (!permission) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color="#6d28d9" />
        <Text style={styles.loadingText}>Checking camera permissions...</Text>
      </View>
    );
  }

  // If permission is denied
  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={64} color="#6d28d9" />
          <Text style={[styles.permissionTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
            Camera Access Required
          </Text>
          <Text style={styles.permissionDesc}>
            We need your permission to use the camera. This is used to attach photographic evidence to your field surveys.
          </Text>
          
          <Pressable 
            style={[styles.primaryBtn, { backgroundColor: '#6d28d9' }]}
            onPress={requestPermission}
          >
            <Text style={styles.primaryBtnText}>Grant Permission</Text>
          </Pressable>

          {!permission.canAskAgain && (
            <Pressable 
              style={styles.secondaryBtn}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.secondaryBtnText}>Open System Settings</Text>
            </Pressable>
          )}

          <Pressable 
            style={styles.backBtn}
            onPress={() => router.push('/(drawer)/(tabs)/new-survey')}
          >
            <Text style={styles.backBtnText}>Go Back to Survey</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Capture Photo Callback
  const handleCapture = async () => {
    if (cameraRef.current && isCameraReady && !isCapturing) {
      try {
        setIsCapturing(true);
        const options = { quality: 0.8, skipProcessing: false };
        const photo = await cameraRef.current.takePictureAsync(options);
        
        if (photo?.uri) {
          const captureTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLocalPhotoUri(photo.uri);
          setLocalCaptureTime(captureTime);
          
          // Update global survey state immediately
          updateTempSurvey({
            photoUri: photo.uri,
            photoCaptureTime: captureTime,
          });
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Capture Error', 'Failed to capture photo. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // Delete Action with Confirmation
  const handleDeletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLocalPhotoUri(undefined);
            setLocalCaptureTime(undefined);
            
            // Delete photo from context
            updateTempSurvey({
              photoUri: undefined,
              photoCaptureTime: undefined,
            });
          },
        },
      ]
    );
  };

  // Save and go back
  const handleSaveAndExit = () => {
    router.push('/(drawer)/(tabs)/new-survey');
  };

  // Render Image Preview
  if (localPhotoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: localPhotoUri }} style={styles.previewImage} resizeMode="cover" />
        
        {/* Timestamp Overlay */}
        <View style={[styles.timeBadge, { top: insets.top + 20 }]}>
          <Ionicons name="time" size={14} color="#ffffff" />
          <Text style={styles.timeBadgeText}>Captured at {localCaptureTime}</Text>
        </View>

        {/* Floating Top Bar Back Button */}
        <Pressable 
          style={[styles.closePreviewBtn, { top: insets.top + 16 }]}
          onPress={handleSaveAndExit}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </Pressable>

        {/* Action Controls */}
        <View style={[styles.previewActions, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable style={styles.actionRoundBtn} onPress={handleDeletePhoto}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="trash" size={24} color="#ef4444" />
            </View>
            <Text style={styles.actionLabel}>Delete</Text>
          </Pressable>

          <Pressable style={styles.actionRoundBtn} onPress={() => {
            setLocalPhotoUri(undefined);
            setLocalCaptureTime(undefined);
            updateTempSurvey({
              photoUri: undefined,
              photoCaptureTime: undefined,
            });
          }}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="refresh" size={24} color="#d97706" />
            </View>
            <Text style={styles.actionLabel}>Retake</Text>
          </Pressable>

          <Pressable style={styles.actionRoundBtn} onPress={handleSaveAndExit}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="checkmark" size={24} color="#10b981" />
            </View>
            <Text style={styles.actionLabel}>Keep Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Render Camera View
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* Opening Camera Loading Overlay */}
      {!isCameraReady && (
        <View style={styles.cameraLoadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.cameraLoadingText}>Opening Camera...</Text>
        </View>
      )}

      {/* Top Controls Overlay */}
      <View style={[styles.topControls, { paddingTop: insets.top + 10 }]}>
        <Pressable 
          style={styles.circularBackBtn} 
          onPress={() => router.push('/(drawer)/(tabs)/new-survey')}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.cameraTitle}>Site Camera</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {/* Bottom Controls Overlay */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
        <View style={{ width: 64 }} /> {/* Spacer */}

        {/* Capture Trigger */}
        <Pressable 
          style={({ pressed }) => [
            styles.captureButton, 
            { opacity: pressed || isCapturing ? 0.8 : 1 }
          ]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          {isCapturing ? (
            <ActivityIndicator size="large" color="#6d28d9" />
          ) : (
            <View style={styles.captureInnerCircle} />
          )}
        </Pressable>

        <View style={{ width: 64 }} /> {/* Spacer */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionCard: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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
    borderColor: '#6d28d9',
    marginTop: 12,
  },
  secondaryBtnText: {
    color: '#6d28d9',
    fontSize: 15,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 20,
    padding: 8,
  },
  backBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cameraLoadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  topControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 5,
  },
  circularBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewImage: {
    flex: 1,
  },
  timeBadge: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  closePreviewBtn: {
    position: 'absolute',
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  actionRoundBtn: {
    alignItems: 'center',
    gap: 6,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
