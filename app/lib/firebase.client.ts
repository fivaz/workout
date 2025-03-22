import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
	getFirestore,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const config = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (getApps().length) {
	app = getApp();
} else {
	app = initializeApp(config);
	initializeFirestore(app, {
		localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
	});
}

export const db = getFirestore(app);
export const auth = getAuth(app);

export const storage = getStorage(app);
