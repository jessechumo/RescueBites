import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Image
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { sendNotificationToTopic } from '../utils/notifications';

export default function AddFoodScreen({ navigation }) {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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

    if (!imageUrl) {
      Alert.alert('Missing Image', 'Please add an image of the food.');
      return false;
    }

    return true;
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
      if (result.didCancel) return;
      if (result.assets && result.assets[0]) {
        await uploadImageToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
      if (result.didCancel) return;
      if (result.assets && result.assets[0]) {
        await uploadImageToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    try {
      const base64Image = await uriToBase64(uri);
      const cloudName = 'dwlot7xkj'; // replace with your cloudinary cloud name
      const uploadPreset = 'ml_default'; // replace with your upload preset
      const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          file: `data:image/jpeg;base64,${base64Image}`,
          upload_preset: uploadPreset,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Cloudinary upload failed');
      console.log('Image uploaded:', data.secure_url);

      setImageUrl(data.secure_url);
      Alert.alert('Success', 'Image uploaded successfully.');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  const uriToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
        imageUrl,
        donorId: user.uid,
        donorEmail: user.email,
        foodStatus: 'Available',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      await fetch('http://10.188.230.155:5000/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'beneficiaries',
          title: 'New Food Available!',
          body: `${type} available at ${pickupLocation}`,
        }),
      });

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

        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImageUrl('')}>
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, uploading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Donation</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 14, marginBottom: 16, borderRadius: 8, backgroundColor: '#f9f9f9' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  button: { backgroundColor: '#f0f0f0', padding: 14, borderRadius: 8, alignItems: 'center', minWidth: 120 },
  buttonText: { color: '#333', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#28a745', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabledButton: { backgroundColor: '#93c9a1' },
  imageContainer: { alignItems: 'center', marginVertical: 10 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8 },
  removeImageText: { color: 'red', marginTop: 10, fontWeight: '600' },
});
