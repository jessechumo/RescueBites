import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export default function CameraPermissionScreen({ navigation }) {
  useEffect(() => {
    async function checkPermissions() {
      let cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted') {
        cameraPermission = await Camera.requestCameraPermission();
      }

      let micPermission = await Camera.getMicrophonePermissionStatus();
      if (micPermission !== 'granted') {
        micPermission = await Camera.requestMicrophonePermission();
      }

      if (cameraPermission === 'granted' && micPermission === 'granted') {
        navigation.replace('Login');
      } else {
        Alert.alert(
          'Permissions Required',
          'Camera and microphone access are needed for QR scanning and photo capture. You can grant them in your device settings.',
          [{ text: 'Continue', onPress: () => navigation.replace('Login') }],
        );
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
