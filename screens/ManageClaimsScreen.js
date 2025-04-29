import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigation } from '@react-navigation/native';
import { sendNotificationToUser } from '../utils/notifications'; // <-- ADD THIS IMPORT

export default function ManageClaimsScreen() {
  const [claims, setClaims] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [decision, setDecision] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('claims')
      .where('donorId', '==', uid)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClaims(data);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (claim, decisionType) => {
    setSelectedClaim(claim);
    setDecision(decisionType);
    setMessage('');
    setModalVisible(true);
  };

  const handleDecision = async () => {
    if (!selectedClaim) return;

    try {
      const claimRef = firestore().collection('claims').doc(selectedClaim.id);

      await claimRef.update({
        status: decision,
        decisionMessage: message || '',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // ✅ Send push notification to the beneficiary
      await sendNotificationToUser(
        selectedClaim.beneficiaryId,
        `Your claim was ${decision}!`,
        decision === 'Approved'
          ? `Your claim for ${selectedClaim.foodType} was approved!`
          : `Your claim for ${selectedClaim.foodType} was denied.`
      );

      setModalVisible(false);
      Alert.alert('Success', `Claim ${decision.toLowerCase()}!`);
    } catch (error) {
      console.error('Error updating claim:', error);
      Alert.alert('Error', error.message || 'Failed to update claim.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.typeText}>Food: {item.foodType}</Text>
      <Text>Beneficiary: {item.beneficiaryEmail}</Text>
      <Text>Status: {item.status}</Text>

      {item.status === 'Pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#28a745' }]}
            onPress={() => openModal(item, 'Approved')}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#dc3545' }]}
            onPress={() => openModal(item, 'Denied')}
          >
            <Ionicons name="close-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={claims}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No claims yet.</Text>}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{decision} Claim</Text>
            <TextInput
              placeholder="Optional message (e.g., 'Pick up by 5PM')"
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleDecision}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavbar navigation={navigation} activeScreen="AddListing" userType="Donor" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  card: { backgroundColor: '#f9f9f9', padding: 12, marginBottom: 10, borderRadius: 8 },
  typeText: { fontWeight: 'bold', fontSize: 16 },
  buttonRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  button: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 6, flex: 0.48, justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 6, padding: 10, marginBottom: 20 },
  modalButton: { backgroundColor: '#28a745', padding: 14, borderRadius: 6, marginBottom: 10, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
