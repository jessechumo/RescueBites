// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AddListingScreen from '../screens/AddListingScreen';
import EditListingScreen from '../screens/EditListingScreen';
import BrowseFoodScreen from '../screens/BrowseFoodScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import ProfileScreen from '../screens/ProfileScreen'; 
import ClaimStatusScreen from '../screens/ClaimStatusScreen';
import DonorReportScreen from '../screens/DonorReportScreen'; 
import ManageClaimsScreen from '../screens/ManageClaimsScreen';
import ClaimDetailsScreen from '../screens/ClaimDetailsScreen';
import ScannerScreen from '../screens/ScannerScreen';
import DistributorScreen from '../screens/DistributorScreen';

// import CameraPermissionScreen from '../components/CameraPermission';  
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return ( 

    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddListing" component={AddListingScreen} />
      <Stack.Screen name="EditListing" component={EditListingScreen} />
      <Stack.Screen name="BrowseFood" component={BrowseFoodScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />  
      <Stack.Screen name="ClaimStatus" component={ClaimStatusScreen} />
      <Stack.Screen name="DonorReport" component={DonorReportScreen} />
      <Stack.Screen name="ManageClaims" component={ManageClaimsScreen} /> 
      <Stack.Screen name="ClaimDetails" component={ClaimDetailsScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="Distributor" component={DistributorScreen} />
    </Stack.Navigator> 
  );
}
