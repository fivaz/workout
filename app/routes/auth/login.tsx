import DarkMode from '@/components/DarkMode';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { Form, redirect, useNavigate, useNavigation } from 'react-router';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import type { FirebaseError } from 'firebase-admin';
import GoogleIcon from './GoogleIcon';
import { useState } from 'react';

export default function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function googleSignIn() {
		setIsLoading(true);
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			navigate('/');
		} catch (err) {
			setError('Failed to login. Please try again.');
			console.error('Login error:', err);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<DarkMode />
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Your Company"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=600"
						className="mx-auto h-10 w-auto"
					/>
					<GText className="mt-10 text-center text-2xl/9 font-bold tracking-tight" tag="h2">
						Sign in to your account
					</GText>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<Form navigate={false} method="POST" className="space-y-6">
						<GInput name="email" label="Email address" type="email" required autoComplete="email" />

						<GInput name="password" label="Password" type="password" required />

						<GButton isLoading={isLoading} type="submit">
							Sign in
						</GButton>

						<GButton
							className="bg-white border border-gray-300"
							color="none"
							isLoading={isLoading}
							type="button"
							onClick={googleSignIn}
						>
							<GoogleIcon />
						</GButton>
					</Form>

					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
							Sign up
						</a>
					</p>
				</div>
			</div>
		</>
	);
}
