import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Image, ScrollView, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ClaimDetailsScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const food = params?.food;

  if (!food) return null;

  const openConfirmPickup = () => {
    Alert.alert('Confirm Pickup', 'Choose how to confirm:', [
      { text: 'Scan QR Code', onPress: () => navigation.navigate('Scanner', { food }) },
      {
        text: 'Manual Confirm',
        onPress: () => {
          Alert.alert('Pickup Confirmed', `✅ Pickup confirmed for ${food.foodType}.`);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openRequestDelivery = () => {
    Alert.alert('Request Delivery', `Send a delivery request for ${food.foodType}?`, [
      { text: 'Yes', onPress: () => Alert.alert('Success', 'Delivery requested.') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claim Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {food.imageUrl ? (
            <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
          ) : (
            <View style={[styles.foodImage, styles.placeholder]}>
              <Ionicons name="image-outline" size={48} color="#aaa" />
            </View>
          )}
          <Text style={styles.foodType}>{food.foodType}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Qty:</Text>
            <Text style={styles.value}>{food.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Expiry:</Text>
            <Text style={styles.value}>{food.expiryDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{food.pickupLocation || 'N/A'}</Text>
          </View>
        </View>

        {food.status === 'Approved' && (
          <>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#28a745' }]} onPress={openConfirmPickup}>
              <Ionicons name="qr-code-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Confirm Pickup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF9500' }]} onPress={openRequestDelivery}>
              <Ionicons name="bicycle-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Request Delivery</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f3f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', elevation: 2 },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#333' },
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    alignItems: 'center'
  },
  foodImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  foodType: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 4 },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 16, fontWeight: '500', color: '#333' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12
  },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
