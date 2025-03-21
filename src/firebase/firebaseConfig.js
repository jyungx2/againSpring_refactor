// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// [추가] Google 로그인 등 Firebase 인증을 위해 getAuth import
import { getAuth } from 'firebase/auth';

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

export const analytics = getAnalytics(app);

export const auth = getAuth(app);
