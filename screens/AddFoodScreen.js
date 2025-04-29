import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { sendNotificationToTopic } from '../utils/notifications';

export default function AddFoodScreen({ navigation }) {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [uploading, setUploading] = useState(false);

  const validateInputs = () => {
    if (!type || !quantity || !pickupLocation || !expiryDate) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return false;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Invalid Quantity', 'Quantity must be a positive number.');
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(expiryDate)) {
      Alert.alert('Invalid Expiry Date', 'Expiry date must be in YYYY-MM-DD format.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      setUploading(true);

      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Authentication Error', 'User not logged in.');
        return;
      }

      await firestore().collection('foodItems').add({
        type: type.trim(),
        quantity: parseInt(quantity),
        expiryDate,
        pickupLocation: pickupLocation.trim(),
        donorId: user.uid,
        donorEmail: user.email,
        foodStatus: 'Available',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      await sendNotificationToTopic(
        'New Food Listing!',
        `${type} available at ${pickupLocation}.`
      );

      Alert.alert('Success', 'Food donation submitted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Submission Failed', 'An error occurred while submitting the donation.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Add Food Donation</Text>

        <TextInput
          style={styles.input}
          placeholder="Food Type"
          value={type}
          onChangeText={setType}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (e.g., 5)"
          value={quantity}
          keyboardType="numeric"
          onChangeText={setQuantity}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiry Date (YYYY-MM-DD)"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Pickup Location"
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Donation</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 14, marginBottom: 16, borderRadius: 8, backgroundColor: '#f9f9f9' },
  submitButton: { backgroundColor: '#28a745', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
