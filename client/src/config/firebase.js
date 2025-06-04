import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

// Debug: Log environment variables (remove in production)
console.log('Firebase Config:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'exists' : 'missing',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'exists' : 'missing',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'exists' : 'missing',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? 'exists' : 'missing',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? 'exists' : 'missing',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ? 'exists' : 'missing'
});

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug: Log if any config values are undefined
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing Firebase config value for: ${key}`);
  }
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize messaging only if it's supported
let messaging = null;
isSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

export const requestNotificationPermission = async () => {
  try {
    // Check if messaging is supported
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase Cloud Messaging is not supported in this environment');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      if (!messaging) {
        messaging = getMessaging(app);
      }
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}; 