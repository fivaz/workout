import DarkMode from '@/components/DarkMode';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { data, Form, useActionData, useNavigate, useNavigation } from 'react-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleIcon from './GoogleIcon';
import { useState } from 'react';
import GAlert from '@/components/GAlert';

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { adminAuth } from '@/lib/firebase.server';
import { getSession, commitSession } from '@/sessions.server';
import type { Route } from './+types/Login';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	if (session.has('userId')) {
		// Redirect to the home page if they are already signed in.
		return redirect('/');
	}

	return data(
		{ error: session.get('error') },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
}

export default function Login({ loaderData }: Route.ComponentProps) {
	const { error } = loaderData;
	const navigate = useNavigate();

	const [googleError, setGoogleError] = useState<string | null>(null);
	const navigation = useNavigation();

	async function handleGoogleSignIn() {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const idToken = await result.user.getIdToken();

			// Submit the ID token to the server action
			const formData = new FormData();
			formData.append('idToken', idToken);

			const response = await fetch('/login', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Google sign-in failed');
			}

			navigate('/');
			// If successful, the server will redirect to /dashboard
		} catch (error) {
			setGoogleError(error instanceof Error ? error.message : 'Google sign-in failed');
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

				<GAlert type="error">{error || googleError}</GAlert>

				<div className="flex flex-col gap-5 sm:mx-auto sm:w-full sm:max-w-sm">
					<Form className="space-y-6">
						<GInput name="email" label="Email address" type="email" required autoComplete="email" />

						<GInput name="password" label="Password" type="password" required />

						<GButton isLoading={navigation.state === 'submitting'} type="submit">
							Sign in
						</GButton>

						<GButton
							className="bg-white border border-gray-300"
							color="none"
							isLoading={navigation.state === 'submitting'}
							type="button"
							onClick={handleGoogleSignIn}
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

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	const form = await request.formData();
	const idToken = form.get('idToken') as string;

	if (!idToken) {
		return { error: 'No ID token provided', status: 400 };
	}

	try {
		const decodedToken = await adminAuth.verifyIdToken(idToken);
		// const sessionCookie = await adminAuth.createSessionCookie(idToken, {
		// 	expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
		// });

		// session.set('sessionCookie', sessionCookie);
		session.set('userId', decodedToken.uid);

		// Login succeeded, send them to the home page.
		return redirect('/', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	} catch (error) {
		session.flash('error', error instanceof Error ? error.message : 'Authentication failed');

		// Redirect back to the login page with errors.
		return redirect('/login', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}
}
