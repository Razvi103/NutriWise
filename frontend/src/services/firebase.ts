// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics'; // Included as you provided it
import { getFirestore, Firestore } from 'firebase/firestore'; // Added Firestore import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA1sbtuQIDRwlM5up1G-UuA6oe5ei5Pu2I',
  authDomain: 'nutriwise-deded.firebaseapp.com',
  projectId: 'nutriwise-deded',
  storageBucket: 'nutriwise-deded.appspot.com',
  messagingSenderId: '657715263685',
  appId: '1:657715263685:web:7b869ce2259868279a98ac',
  measurementId: 'G-0FEE35BKY4',
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth: Auth = getAuth(app);

// Initialize Analytics and get a reference to the service
// You included this, so I'm keeping it. Remove if not needed.
const analytics: Analytics = getAnalytics(app);

// Create an instance of the Google provider object
const googleAuthProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db: Firestore = getFirestore(app);

export { app, auth, analytics, googleAuthProvider, db }; // Exported db
