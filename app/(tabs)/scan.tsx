import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Pressable, Alert } from 'react-native';
import { CameraView, CameraType, CameraMode, useCameraPermissions } from 'expo-camera';
import { AntDesign, Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator'; // Add this import
import { useInventoryStore } from '../../store/useInventoryStore';
import Constants from 'expo-constants';
import foodData from './foodData.json'; // Adjust the import path as necessary

const apiKey = Constants.manifest?.extra?.ROBOFLOW_API_KEY;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>('picture');
  const [facing, setFacing] = useState<CameraType>('back');
  const [recording, setRecording] = useState(false);
  const addItem = useInventoryStore((state) => state.addItem);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ base64: true });
      if (photo?.uri) {
        // Resize the image using Expo ImageManipulator
        const resizedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800, height: 800 } }], // Resize to 800x800
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
        );

        // Convert resized image to Base64
        const resizedBase64 = await fetch(resizedImage.uri)
          .then((res) => res.blob())
          .then((blob) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          });

        // Send the resized Base64 image to Roboflow
        const response = await axios({
          method: 'POST',
          url: 'https://detect.roboflow.com/pantry-object-detection/1',
          params: {
            api_key: "TMi5YdMlNrGBnX2Z9B7i", // Use the environment variable
          },
          data: resizedBase64.split(',')[1], // Remove the Base64 prefix
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        // Handle the response
        if (response.data && response.data.predictions) {
          console.log('Detected objects:', response.data.predictions);

          response.data.predictions.forEach((prediction) => {
            const itemName = prediction.class;

            // Find the item in the JSON data
            const matchedItem = foodData.find((item) => item.name.toLowerCase() === itemName.toLowerCase());

            if (matchedItem) {
              const category = matchedItem.category;
              const quantity = 1; // Default quantity

              // Add the item to the global inventory
              addItem({
                name: itemName,
                quantity,
                category,
                expiryDate: '',
              });
              console.log('Item added:', { name: itemName, quantity, category });
            } else {
              console.warn(`Item "${itemName}" not found in food data.`);
            }
          });

          Alert.alert('Success', 'Items detected and added to inventory!');
        } else {
          Alert.alert('No Items Detected', 'No objects were detected in the image.');
        }
      }
    } catch (error) {
      console.error('Error detecting objects:', error);
      Alert.alert('Error', 'Failed to detect objects.');
    }
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      cameraRef.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await cameraRef.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'picture' ? 'video' : 'picture'));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const renderPicture = () => (
    <View style={styles.previewContainer}>
      <Image source={{ uri }} style={styles.previewImage} />
      <TouchableOpacity style={styles.captureButton} onPress={() => setUri(null)}>
        <Text style={styles.buttonText}>Retake</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCamera = () => (
    <CameraView
      style={styles.camera}
      ref={cameraRef}
      mode={mode}
      facing={facing}
      responsiveOrientationWhenOrientationLocked
    >
      <View style={styles.controls}>
        <Pressable onPress={toggleMode}>
          {mode === 'picture' ? (
            <AntDesign name="picture" size={32} color="white" />
          ) : (
            <Feather name="video" size={32} color="white" />
          )}
        </Pressable>
        <Pressable onPress={mode === 'picture' ? takePicture : recordVideo}>
          <View style={styles.shutterButton}>
            <View
              style={[
                styles.shutterButtonInner,
                { backgroundColor: mode === 'picture' ? 'white' : 'red' },
              ]}
            />
          </View>
        </Pressable>
        <Pressable onPress={toggleFacing}>
          <FontAwesome6 name="rotate-left" size={32} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );

  return <View style={styles.container}>{uri ? renderPicture() : renderCamera()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  shutterButton: {
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: 'white',
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  captureButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});