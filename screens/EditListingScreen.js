// screens/EditListingScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

export default function EditListingScreen({ route, navigation }) {
  const { listing } = route.params;
  const [type, setType] = useState(listing.type);
  const [quantity, setQuantity] = useState(listing.quantity.toString());
  const [expiryDate, setExpiryDate] = useState(listing.expiryDate);
  const [pickupLocation, setPickupLocation] = useState(listing.pickupLocation);
  const [imageUrl, setImageUrl] = useState(listing.imageUrl);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const newImageUri = result.assets[0].uri;
        const uploadedUrl = await uploadImage(newImageUri);
        setImageUrl(uploadedUrl);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) throw new Error('No image selected');
    setUploading(true);

    try {
      const base64Img = await RNFS.readFile(uri, 'base64');

      const cloudName = 'dwlot7xkj'; // Replace with your Cloudinary cloud name
      const uploadPreset = 'ml_default'; // Replace with your upload preset

      const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const data = {
        file: `data:image/jpeg;base64,${base64Img}`,
        upload_preset: uploadPreset,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(responseData);
        throw new Error('Cloudinary upload failed');
      }

      console.log('Cloudinary Upload Success:', responseData.secure_url);
      return responseData.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const ref = firestore().collection('foodItems').doc(listing.id);
      await ref.update({
        type,
        quantity: parseInt(quantity),
        expiryDate,
        pickupLocation,
        imageUrl,
      });
      Alert.alert('Success', 'Listing updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Update Error', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await firestore().collection('foodItems').doc(listing.id).delete();
      Alert.alert('Deleted', 'Listing deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Delete Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
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
        <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
      ) : null}

      <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
        <Ionicons name="pencil-outline" size={20} color="black" />
        <Text style={styles.iconButtonText}>EDIT IMAGE</Text>
      </TouchableOpacity>

      {uploading && (
        <ActivityIndicator size="large" color="#28a745" style={{ marginVertical: 10 }} />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete}>
        <Text style={styles.deleteText}>DELETE LISTING</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#ddd',
    padding: 14,
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 20,
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
