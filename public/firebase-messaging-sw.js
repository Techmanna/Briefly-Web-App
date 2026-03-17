// Import the scripts for Firebase App and Messaging
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAvoFBvrGanZn2swaO9LgajAKNcCSatK9A",
  authDomain: "briefly-c876f.firebaseapp.com",
  projectId: "briefly-c876f",
  storageBucket: "briefly-c876f.firebasestorage.app",
  messagingSenderId: "143748062938",
  appId: "1:143748062938:web:c11a12174f84dad3448fe3",
  measurementId: "G-654E602614"
});

const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'Briefly';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Generic push event listener as a fallback
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const notificationTitle = data.notification?.title || 'Briefly';
    const notificationOptions = {
      body: data.notification?.body || 'New notification',
      icon: '/icon-192x192.png',
      data: data.data || {}
    };
    event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
  }
});
