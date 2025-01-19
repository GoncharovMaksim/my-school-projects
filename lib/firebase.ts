// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBd22TjLzlqNZtsEcKSKKf1CylXhRePcNU',
	authDomain: 'school112-c305c.firebaseapp.com',
	projectId: 'school112-c305c',
	storageBucket: 'school112-c305c.firebasestorage.app',
	messagingSenderId: '296106131475',
	appId: '1:296106131475:web:d7caca06004d4d30a2bfe6',
	measurementId: 'G-DPZFVELQJX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);

// Используйте analytics, например, отправка события
console.log(analytics);
