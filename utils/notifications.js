import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export async function registerForPushNotificationsAsync() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      alert('Failed to get permission for push notifications!');
      return;
    }

    const token = await messaging().getToken();
    console.log('Push Token:', token);

    const userId = auth().currentUser?.uid;
    if (userId) {
      await firestore().collection('userTokens').doc(userId).set({
        fcmToken: token,
      });
    }

    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
  }
}
 
export async function sendNotificationToTopic(title, body, topic = 'beneficiaries') {
  try {
    const message = {
      to: `/topics/${topic}`,
      notification: {
        title,
        body,
      },
      data: { type: 'new_listing' },
    };

    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: 'key=AIzaSyD4A5yagS2yXDxGjqOh7HRfI8tAQLP76YE', // Replace with your real server key!
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending topic notification:', error);
  }
}

export async function sendNotificationToUser(userId, title, body) {
  try {
    const tokenDoc = await firestore().collection('userTokens').doc(userId).get();
    if (!tokenDoc.exists) {
      console.warn('No push token for user', userId);
      return;
    }
    const { fcmToken } = tokenDoc.data();

    const message = {
      to: fcmToken,
      notification: {
        title,
        body,
      },
      data: { type: 'claim_update' },
    };

    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: 'key=AIzaSyD4A5yagS2yXDxGjqOh7HRfI8tAQLP76YE', // Replace with your real server key!
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending user notification:', error);
  }
}
