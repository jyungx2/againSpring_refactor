import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCTgsOXNuGQ86P1jKHygGtzhO6hqOl0V3g',
  authDomain: 'againspringshop.firebaseapp.com',
  projectId: 'againspringshop',
  storageBucket: 'againspringshop.firebasestorage.app',
  messagingSenderId: '894946725472',
  appId: '1:894946725472:web:7c31614c23b7286e453d05',
  measurementId: 'G-MXK6ZDYL5N',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
