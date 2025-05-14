// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-root-toast';
import { SvgXml } from 'react-native-svg';
import { undrawLogin } from '../assets/undraw_login_weas';
import messaging from '@react-native-firebase/messaging';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      const userDoc = await firestore().collection('users').doc(uid).get();
      const userRole = userDoc.exists ? userDoc.data().role : null;

      await registerForPushNotifications(uid); // register for FCM push notifications


      if (userRole === 'Donor') {
        navigation.navigate('AddListing');
      } else if (userRole === 'Beneficiary') {
        await messaging().subscribeToTopic('beneficiaries');
        navigation.navigate('BrowseFood');
      } else if (userRole === 'Distributor') {
        await messaging().subscribeToTopic('distributors');
        navigation.navigate('Distributor');
      } else {
        navigation.navigate('Home');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Input Needed', 'Enter your email first.');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Toast.show('Password reset email sent!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  const registerForPushNotifications = async (uid) => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
      if (enabled) {
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);
  
        if (fcmToken) {
          await firestore().collection('userTokens').doc(uid).set({ fcmToken });
        }
      }
    } catch (error) {
      console.error('FCM registration failed:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <SvgXml xml={undrawLogin} width="100%" height="220" />
      </View>

      <Text style={styles.heading}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>
          Don’t have an account? <Text style={styles.signUpLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  imageContainer: { marginBottom: 20 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8, backgroundColor: '#f9f9f9', color: '#333' },
  button: { backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#333', textAlign: 'center', marginTop: 8, fontSize: 14 },
  signUpLink: { color: '#28a745', fontWeight: 'bold' },
});
