import DarkMode from '@/components/DarkMode';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { Form, useNavigate } from 'react-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import GoogleIcon from './GoogleIcon';
import { useState } from 'react';
import GAlert from '@/components/GAlert';

export default function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState<string>('');
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
			<div className="flex gap-5 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<DarkMode />
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

				<GAlert type="error" setError={setError}>
					{error}
				</GAlert>

				<div className="flex flex-col gap-5 sm:mx-auto sm:w-full sm:max-w-sm">
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

					<p className=" text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<a href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
							Sign up
						</a>
					</p>
				</div>
			</div>
		</>
	);
}
