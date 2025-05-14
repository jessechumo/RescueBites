// screens/ManageListingsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ManageListingsScreen() {
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchListings = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    try {
      const snapshot = await firestore()
        .collection('foodItems')
        .where('donorId', '==', uid)
        .get();

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Could not fetch listings.');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleUpdate = async (id, newData) => {
    try {
      await firestore().collection('foodItems').doc(id).update(newData);
      Alert.alert('Updated!');
      fetchListings();
      setSelected(null); // Unselect after saving
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Update Failed', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await firestore().collection('foodItems').doc(id).delete();
      Alert.alert('Deleted!');
      fetchListings();
    } catch (err) {
      console.error('Delete error:', err);
      Alert.alert('Delete Failed', err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selected === item.id;
    return (
      <View style={styles.item}>
        <Text style={styles.label}>Type: {item.type}</Text>
        <Text>Qty: {item.quantity} | Exp: {item.expiryDate}</Text>
        <Text>Location: {item.pickupLocation}</Text>

        {isSelected ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="New Quantity"
              keyboardType="number-pad"
              defaultValue={item.quantity.toString()}
              onChangeText={(val) => item.quantity = parseInt(val) || 0}
            />
            <TextInput
              style={styles.input}
              placeholder="New Expiry"
              defaultValue={item.expiryDate}
              onChangeText={(val) => item.expiryDate = val}
            />
            <Button
              title="Save Changes"
              onPress={() => handleUpdate(item.id, {
                quantity: item.quantity,
                expiryDate: item.expiryDate,
              })}
            />
            <Button title="Cancel" onPress={() => setSelected(null)} />
          </>
        ) : (
          <>
            <Button title="Edit" onPress={() => setSelected(item.id)} />
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={listings}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
