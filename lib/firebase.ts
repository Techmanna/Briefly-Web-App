// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvoFBvrGanZn2swaO9LgajAKNcCSatK9A",
  authDomain: "briefly-c876f.firebaseapp.com",
  projectId: "briefly-c876f",
  storageBucket: "briefly-c876f.firebasestorage.app",
  messagingSenderId: "143748062938",
  appId: "1:143748062938:web:c11a12174f84dad3448fe3",
  measurementId: "G-654E602614"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics (only in browser and if supported)
export const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

// Initialize Messaging
export const getFCM = async () => {
  if (typeof window !== 'undefined' && await isMessagingSupported()) {
    return getMessaging(app);
  }
  return null;
};

export default app;
