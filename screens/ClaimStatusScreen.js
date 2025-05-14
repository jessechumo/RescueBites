// screens/ClaimStatusScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigation } from '@react-navigation/native';

export default function ClaimStatusScreen() {
  const [claims, setClaims] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('claims')
      .where('beneficiaryId', '==', uid)
      .onSnapshot(snapshot => {
        const baseClaims = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        Promise.all(
          baseClaims.map(async claim => {
            try {
              const foodDoc = await firestore().collection('foodItems').doc(claim.foodId).get();
              return foodDoc.exists ? { ...claim, ...foodDoc.data() } : claim;
            } catch {
              return claim;
            }
          })
        ).then(enriched => setClaims(enriched));
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    const statusColor =
      item.status === 'Approved' ? '#28a745' :
      item.status === 'Denied'   ? '#dc3545' :
                                   '#6c757d';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ClaimDetails', { food: item })}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
        ) : (
          <View style={[styles.foodImage, styles.placeholder]}>
            <Text>No Image</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.foodType}>{item.foodType}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
          <Text style={styles.location}>{item.pickupLocation || 'No location'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>Your Claim Status</Text>
        <FlatList
          data={claims}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<Text style={styles.empty}>No claims found.</Text>}
        />
      </View>
      <BottomNavbar userType="Beneficiary" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 60 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16, elevation: 2, flexDirection: 'row', overflow: 'hidden' },
  foodImage: { width: 100, height: 100 },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' },
  infoContainer: { flex: 1, padding: 12, justifyContent: 'center' },
  foodType: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  status: { fontSize: 14, fontWeight: 'bold', marginVertical: 2 },
  location: { fontSize: 13, color: '#777' },
  empty: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 50 },
});
