const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initAdmin() {
  const adminUser = {
    uid: 'NILwQBNIIcQN6nKwdb2LIkdNXF52',
    email: 'rujskiddao@gmail.com',
    displayName: 'Admin',
    isPremium: true,
    isAdmin: true,
    credits: 999,
    freeReadingsCount: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', adminUser.uid), adminUser);
    console.log('Admin user created successfully!');
    console.log('Email: rujskiddao@gmail.com');
    console.log('UID: NILwQBNIIcQN6nKwdb2LIkdNXF52');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

initAdmin();
