// components/BottomNavbar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavbar = ({ userType }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = {
    Donor: [
      { label: 'Profile',   icon: 'person-outline',       screen: 'Profile' },
      { label: 'Listings',  icon: 'list-outline',         screen: 'AddListing' },
      { label: 'Claims',    icon: 'notifications-outline',screen: 'ManageClaims' },
      { label: 'Report',    icon: 'document-outline',     screen: 'DonorReport' },
    ],
    Beneficiary: [
      { label: 'Profile',   icon: 'person-outline',       screen: 'Profile' },
      { label: 'Browse',    icon: 'search-outline',       screen: 'BrowseFood' },
      { label: 'Claims',    icon: 'clipboard-outline',    screen: 'ClaimStatus' },  // ← added
    ],
    Distributor: [
      { label: 'Profile',     icon: 'person-outline',     screen: 'Profile' },
      { label: 'Deliveries',  icon: 'navigate-outline',   screen: 'ManageDeliveries' },
    ],
  };

  const currentTabs = tabs[userType] || [];
  const isActive    = (screen) => route.name === screen;

  return (
    <View style={styles.container}>
      {currentTabs.map((tab, i) => (
        <TouchableOpacity
          key={i}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.screen)}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={isActive(tab.screen) ? '#28a745' : '#555'}
          />
          <Text style={[styles.label, isActive(tab.screen) && { color: '#28a745' }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavbar;

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical:8,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
});
