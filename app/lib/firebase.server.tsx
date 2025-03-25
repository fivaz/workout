import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseConfig = {
	credential: cert({
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	}),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
