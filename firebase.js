// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // React Native AsyncStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAQ8WzGliqAZgJTi_77EVsnGiLB53I8Ge4',
  authDomain: 'patientdoctorloginflow.firebaseapp.com',
  projectId: 'patientdoctorloginflow',
  storageBucket: 'patientdoctorloginflow.appspot.com',
  messagingSenderId: '930929626458',
  appId: '1:930929626458:web:70c02f60cd9b544a24b763',
  measurementId: 'G-DL7CR61EFZ'
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
