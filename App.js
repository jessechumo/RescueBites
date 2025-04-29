// App.js
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ✅ ADD this
import AppNavigator from './navigation/AppNavigator';

import notifee, { AndroidImportance } from '@notifee/react-native';

export default function App() {
  useEffect(() => {
    async function setupNotificationChannel() {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }
    }

    setupNotificationChannel();
  }, []);

  return (
    <SafeAreaProvider> {/* ✅ Wrap whole app in SafeAreaProvider */}
      <NavigationContainer>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
});
