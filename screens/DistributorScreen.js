import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BottomNavbar from '../components/BottomNavbar';


const arlingtonPlaces = [
  'UTA Main Library',
  'AT&T Stadium',
  'River Legacy Park',
  'Downtown Arlington',
  'Texas Health Arlington',
  'Arlington Museum of Art',
  'TCC Southeast Campus',
  'Randol Mill Park',
  'Globe Life Field',
  'Fielder Plaza',
];

function getRandomPlace() {
  const index = Math.floor(Math.random() * arlingtonPlaces.length);
  return arlingtonPlaces[index];
}

function getRandomFutureTime() {
  const now = new Date();
  const future = new Date(now.getTime() + Math.random() * 3 * 60 * 60 * 1000); // up to 3 hours ahead
  return future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function DistributorScreen() {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('claims')
      .where('status', '==', 'Approved') 
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const item = doc.data();
          return {
            id: doc.id,
            ...item,
            deliveryLocation: item.deliveryLocation || getRandomPlace(),
            deliverBy: item.deliverBy || getRandomFutureTime(),
          };
        });
        setDistributions(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.foodType}>Food: {item.foodType}</Text>
      <Text>Beneficiary: {item.beneficiaryEmail}</Text>
      <Text>Deliver to: {item.deliveryLocation}</Text>
      <Text>Deliver by: {item.deliverBy}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Distributions</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <FlatList
          data={distributions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>No assigned distributions yet.</Text>
          }
          contentContainerStyle={{ paddingBottom: 80 }} 
        />
      )}
       <BottomNavbar userType="Distributor" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#28a745' },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  foodType: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
