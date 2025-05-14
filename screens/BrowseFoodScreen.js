// screens/BrowseFoodScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigation } from '@react-navigation/native';
import { sendNotificationToUser } from '../utils/notifications';

export default function BrowseFoodScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('foodItems')
      .where('foodStatus', '==', 'Available')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(items);
        setFilteredListings(items);
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFilteredListings(
      listings.filter(item =>
        item.type.toLowerCase().includes(searchText.toLowerCase()) ||
        item.pickupLocation.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, listings]);

  const handleClaim = async foodItem => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to claim food.');
      return;
    }
    try {
      await firestore().collection('claims').add({
        foodId: foodItem.id,
        foodType: foodItem.type,
        donorId: foodItem.donorId || '',
        beneficiaryId: currentUser.uid,
        beneficiaryEmail: currentUser.email,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        imageUrl: foodItem.imageUrl,
        pickupLocation: foodItem.pickupLocation,
      });

      // ✉️ NEW: Notify the donor
    const donorTokenDoc = await firestore()
  .collection('userTokens')
  .doc(foodItem.donorId)
  .get();

if (donorTokenDoc.exists) {
  const { fcmToken } = donorTokenDoc.data();
  
  await fetch('http://10.188.230.155:5000/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: fcmToken,
      title: 'New Claim Received!',
      body: `Someone claimed your food: ${foodItem.type}`,
    }),
  });
}


    Alert.alert('Success', 'Claim sent to the donor!');
  } catch (error) {
    console.error('Claim error:', error);
    Alert.alert('Error', error.message || 'Failed to claim food.');
  }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text>No Image</Text>
          </View>
        )}
        <View style={styles.detailsAndButton}>
          <View style={styles.details}>
            <Text style={styles.typeText}>{item.type} - Qty: {item.quantity}</Text>
            <Text style={styles.expiryText}>Exp: {item.expiryDate}</Text>
            <Text style={styles.locationText}>{item.pickupLocation}</Text>
          </View>
          <TouchableOpacity style={styles.claimButton} onPress={() => handleClaim(item)}>
            <Ionicons name="hand-right-outline" size={18} color="#fff" />
            <Text style={styles.claimButtonText}>Claim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search by food type or location"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {/* Food List */}
      <FlatList
        data={filteredListings}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No items available.</Text>}
      />
      <BottomNavbar userType="Beneficiary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    margin: 12,
    backgroundColor: '#fff',
  },
  searchInput: { flex: 1, marginLeft: 8, height: 40 },
  card: { backgroundColor: '#f9f9f9', padding: 12, marginHorizontal: 12, marginBottom: 10, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' },
  detailsAndButton: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  details: { flex: 1 },
  claimButton: { flexDirection: 'row', backgroundColor: '#28a745', padding: 10, borderRadius: 6 },
  claimButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  typeText: { fontWeight: 'bold', fontSize: 16 },
  expiryText: { fontSize: 14, color: '#555' },
  locationText: { fontSize: 14, color: '#555', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
