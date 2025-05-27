import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA1sbtuQIDRwlM5up1G-UuA6oe5ei5Pu2I',
  authDomain: 'nutriwise-deded.firebaseapp.com',
  projectId: 'nutriwise-deded',
  storageBucket: 'nutriwise-deded.appspot.com',
  messagingSenderId: '657715263685',
  appId: '1:657715263685:web:7b869ce2259868279a98ac',
  measurementId: 'G-0FEE35BKY4',
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);

const analytics: Analytics = getAnalytics(app);

const googleAuthProvider = new GoogleAuthProvider();

const db: Firestore = getFirestore(app);

export { app, auth, analytics, googleAuthProvider, db }; // Exported db
