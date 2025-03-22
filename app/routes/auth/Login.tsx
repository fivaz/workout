import DarkMode from '@/components/DarkMode';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { Form, useActionData, useNavigate, useNavigation } from 'react-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleIcon from './GoogleIcon';
import { useState } from 'react';
import GAlert from '@/components/GAlert';

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { adminAuth } from '@/lib/firebase.server';
import { commitSession, getSession } from '@/lib/session';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request);
	if (session.get('userId')) {
		return redirect('/');
	}
	return {};
}

export default function Login() {
	const [googleError, setGoogleError] = useState<string | null>(null);
	const navigation = useNavigation();
	const actionData = useActionData<typeof action>();
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

				<GAlert type="error">{actionData?.error || googleError}</GAlert>

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

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const idToken = formData.get('idToken') as string;

	if (!idToken) {
		return { error: 'No ID token provided', status: 400 };
	}

	try {
		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
		});

		const session = await getSession(request);
		session.set('sessionCookie', sessionCookie);
		session.set('userId', decodedToken.uid);

		return redirect('/', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'Authentication failed', status: 400 };
	}
}
