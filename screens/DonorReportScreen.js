// screens/DonorReportScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigation } from '@react-navigation/native';

export default function DonorReportScreen() {
  const [totalListings, setTotalListings] = useState(0);
  const [approvedClaims, setApprovedClaims] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [uniqueBeneficiaries, setUniqueBeneficiaries] = useState(0);
  const [latestDonationDate, setLatestDonationDate] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchReportData = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        console.error('No user logged in');
        return;
      }

      // Fetch food listings
      const listingsSnapshot = await firestore()
        .collection('foodItems')
        .where('donorId', '==', uid)
        .get();

      const listings = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setTotalListings(listings.length);

      const quantitySum = listings.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setTotalQuantity(quantitySum);

      // Find latest createdAt date
      if (listings.length > 0) {
        const latest = listings
          .map(item => item.createdAt?.toDate?.() || new Date(0))
          .sort((a, b) => b - a)[0];
        setLatestDonationDate(latest.toDateString());
      } else {
        setLatestDonationDate('');
      }

      // Fetch approved claims
      const claimsSnapshot = await firestore()
        .collection('claims')
        .where('donorId', '==', uid)
        .where('status', '==', 'Approved')
        .get();

      const claims = claimsSnapshot.docs.map(doc => doc.data());

      setApprovedClaims(claims.length);

      // Unique beneficiaries
      const beneficiariesSet = new Set(claims.map(claim => claim.beneficiaryId));
      setUniqueBeneficiaries(beneficiariesSet.size);

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>Your Donation Report</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Total Listings Created:</Text>
            <Text style={styles.value}>{totalListings}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Successful Pickups (Approved Claims):</Text>
            <Text style={styles.value}>{approvedClaims}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Total Quantity Donated:</Text>
            <Text style={styles.value}>{totalQuantity} items</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Unique Beneficiaries Helped:</Text>
            <Text style={styles.value}>{uniqueBeneficiaries}</Text>
          </View>

          {latestDonationDate ? (
            <View style={styles.card}>
              <Text style={styles.label}>Latest Donation Date:</Text>
              <Text style={styles.value}>{latestDonationDate}</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.label}>No Donations Yet.</Text>
            </View>
          )}
        </ScrollView>

        <BottomNavbar userType="Donor" activeScreen="Report" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
