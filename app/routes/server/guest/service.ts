import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { FirebaseError } from 'firebase/app';
import type { FormEvent } from 'react';

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
	const provider = new GoogleAuthProvider();
	const result = await signInWithPopup(auth, provider);
	return await result.user.getIdToken();
}

export async function login(event: FormEvent<HTMLFormElement>) {
	event.preventDefault();

	// Get form data
	const formData = new FormData(event.currentTarget);
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	// Sign in user with email and password
	const result = await signInWithEmailAndPassword(auth, email, password);
	return await result.user.getIdToken();
}

export async function register(event: FormEvent<HTMLFormElement>) {
	event.preventDefault();

	// Get form data
	const formData = new FormData(event.currentTarget);
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	// Create user with email and password
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);

	// Update user profile with name
	await updateProfile(userCredential.user, { displayName: name });
	return await userCredential.user.getIdToken();
}
