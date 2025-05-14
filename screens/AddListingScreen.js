// screens/AddListingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert, Image, TouchableOpacity
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import BottomNavbar from '../components/BottomNavbar';

export default function AddListingScreen({ navigation }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const donorId = auth().currentUser?.uid;
    const unsubscribe = firestore()
      .collection('foodItems')
      .onSnapshot((snapshot) => {
        const items = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.donorId === donorId);
        setListings(items);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await firestore().collection('foodItems').doc(id).delete();
    } catch (error) {
      console.error(error);
      Alert.alert('Delete Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Add New Listing Button at the Top */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFood')}>
        <Text style={styles.addButtonText}>Add New Listing</Text>
      </TouchableOpacity>

      {/* FlatList */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text>No Image</Text>
                </View>
              )}
              <View style={styles.details}>
                <Text style={styles.text}>{item.type} - Qty: {item.quantity}</Text>
                <Text style={styles.text}>Exp: {item.expiryDate}</Text>
                <Text style={styles.text}>Location: {item.pickupLocation}</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.edit]}
                onPress={() => navigation.navigate('EditListing', { listing: item })}
              >
                <Text style={styles.buttonText}>EDIT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.delete]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={[styles.buttonText, { color: 'red' }]}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <BottomNavbar userType="Donor" />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 12, backgroundColor: '#fff', paddingBottom: 80 },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    margin: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 6,
  },
  details: { flex: 1 },
  text: { fontSize: 16 },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  buttonText: { fontWeight: 'bold' },
});
