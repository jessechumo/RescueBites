import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../components/BottomNavbar';

const DEFAULT_REGION = {
  latitude: 32.7357,
  longitude: -97.1081,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    fetchFoodItems();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setLocationError(true);
        setLoading(false);
      }
    } catch {
      setLocationError(true);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLoading(false);
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            500,
          );
        }
      },
      () => {
        setLocationError(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const fetchFoodItems = () => {
    const unsubscribe = firestore()
      .collection('foodItems')
      .where('foodStatus', '==', 'Available')
      .onSnapshot(snapshot => {
        const items = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.latitude && item.longitude);
        setFoodItems(items);
      });
    return unsubscribe;
  };

  const centerOnUser = () => {
    if (!userLocation) {
      Alert.alert('Location Unavailable', 'GPS location could not be determined.');
      return;
    }
    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      500,
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          userLocation
            ? {
                ...userLocation,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : DEFAULT_REGION
        }
        showsUserLocation={!locationError}
        showsMyLocationButton={false}>
        {foodItems.map(item => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            title={item.type}
            description={`${item.pickupLocation} — Qty: ${item.quantity}`}
            pinColor="#28a745"
          />
        ))}
      </MapView>

      {locationError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            Location permission denied. Showing default area.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.centerBtn} onPress={centerOnUser}>
        <Ionicons name="navigate" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#28a745' }]} />
          <Text style={styles.legendText}>Available Pickup Point</Text>
        </View>
        <Text style={styles.legendCount}>
          {foodItems.length} location{foodItems.length !== 1 ? 's' : ''} shown
        </Text>
      </View>

      <BottomNavbar userType="Beneficiary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: { marginTop: 12, color: '#555', fontSize: 15 },
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#dc3545',
    padding: 8,
    alignItems: 'center',
  },
  errorText: { color: '#fff', fontSize: 13 },
  centerBtn: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    backgroundColor: '#28a745',
    borderRadius: 28,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  legend: {
    position: 'absolute',
    bottom: 75,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 12, color: '#333' },
  legendCount: { fontSize: 11, color: '#666', marginTop: 2 },
});
