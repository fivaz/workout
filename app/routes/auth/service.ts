import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { FirebaseError } from 'firebase/app';

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
	'auth/weak-password': 'The password is too weak. Please use at least 6 characters.',
	'auth/invalid-credential': 'The email or password is incorrect. Please try again.',
	'auth/email-already-in-use': 'This email is already registered. Please use a different email.',
	'auth/user-not-found': 'No account exists with this email. Please sign up.',
	'auth/wrong-password': 'Incorrect password. Please try again.',
	'auth/too-many-requests': 'Too many attempts. Please try again later.',
	'auth/invalid-email': 'The email address is not valid. Please check and try again.',
	'auth/user-disabled': 'This account has been disabled. Please contact support.',
	'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
};

export function getErrorMessage(error: unknown): string {
	if (error instanceof FirebaseError) {
		return FIREBASE_ERROR_MESSAGES[error.code] || 'An unexpected error occurred. Please try again.';
	}
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

export async function googleSignIn() {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const idToken = await result.user.getIdToken();

		const response = await fetch('/login', {
			method: 'POST',
			body: new URLSearchParams({ idToken }),
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error || 'Google sign-in failed');
		}
	} catch (error) {
		return getErrorMessage(error);
	}
}
