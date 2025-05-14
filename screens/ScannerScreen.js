import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ScannerScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const devices = useCameraDevices();
  const device = devices.back;
  const successTimerRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setCameraPermission(permission);
    })();
  }, []);

  useEffect(() => {
    if (cameraReady) {
      successTimerRef.current = setTimeout(() => {
        Alert.alert('Success', `✅ Pickup confirmed for ${params?.food?.foodType || 'item'}!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }, 4000);
    }

    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [cameraReady, navigation, params?.food?.foodType]);

  if (cameraPermission !== 'authorized') {
    // Still waiting for permission
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff' }}>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff' }}>Loading Camera Device...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        onInitialized={() => setCameraReady(true)}
        photo={true}
      />
      <View style={styles.overlay}>
        <Text style={styles.scannerText}>Scanning...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  overlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  scannerText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
