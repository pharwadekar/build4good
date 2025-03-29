import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Camera as CameraIcon, Camera as FlipCamera } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useThemeStore } from '@/store/useThemeStore';
import { detectObjects } from '@/utils/objectDetection';
import { lightTheme, darkTheme } from '@/utils/theme';

export default function ScanScreen() {
  const [type, setType] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef(null);
  const { addItem } = useInventoryStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.permissionText, { color: theme.text }]}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: theme.primary }]}
          onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current && !processing) {
      setProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
        });

        const detectionResult = await detectObjects(photo.base64);
        
        detectionResult.predictions.forEach((prediction) => {
          addItem({
            name: prediction.class,
            quantity: 1,
            category: 'Detected',
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        });
      } catch (error) {
        console.error('Error capturing image:', error);
      } finally {
        setProcessing(false);
      }
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.webText, { color: theme.text }]}>
          Camera functionality is not available on web.
        </Text>
        <Text style={[styles.webSubtext, { color: theme.textSecondary }]}>
          Please use a mobile device to scan items.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={type}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Scan Item</Text>
          </View>
          <View style={styles.scanArea}>
            <View style={[styles.scanFrame, { borderColor: theme.primary }]} />
          </View>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: `${theme.primary}CC` }]}
              onPress={() => setType(current => (current === 'back' ? 'front' : 'back'))}>
              <FlipCamera size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: theme.primary }]}
              onPress={handleCapture}
              disabled={processing}>
              <CameraIcon size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    marginRight: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  webText: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginTop: 40,
  },
  webSubtext: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});