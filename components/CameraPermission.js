import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export default function CameraPermissionScreen({ navigation }) {
  useEffect(() => {
    async function checkPermissions() {
      let cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'authorized') {
        cameraPermission = await Camera.requestCameraPermission();
      }

      let micPermission = await Camera.getMicrophonePermissionStatus();
      if (micPermission !== 'authorized') {
        micPermission = await Camera.requestMicrophonePermission();
      }

      // Important: cameraPermission and micPermission are the results of request functions
      if (cameraPermission === 'authorized' && micPermission === 'authorized') {
        navigation.replace('Login');
      } else {
        // Optional: handle if user denies permission
        console.warn('Camera or Microphone permission not granted.');
      }
    }

    checkPermissions();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Checking Permissions...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
