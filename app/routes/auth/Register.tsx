import type { Route } from './+types/Register';
import { data, Form, NavLink, redirect, useNavigate, useNavigation } from 'react-router';
import { type FormEvent, useState } from 'react';
import { getErrorMessage, googleSignIn } from '@/routes/auth/service';
import GText from '@/components/GText';
import GAlert from '@/components/GAlert';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GoogleIcon from '@/routes/auth/GoogleIcon';
import { ROUTES } from '@/lib/consts';
import { commitSession, getSession } from '@/sessions.server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';

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

export default function Register({ loaderData }: Route.ComponentProps) {
	const { error } = loaderData;
	const navigate = useNavigate();

	const [clientError, setClientError] = useState<string>('');
	const navigation = useNavigation();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get form data
		const formData = new FormData(event.currentTarget);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);

			// Update user profile with name
			await updateProfile(userCredential.user, { displayName: name });

			// Navigate to home page on success
			navigate('/');
		} catch (error) {
			setClientError(getErrorMessage(error));
		}
	}

	async function handleGoogleSignIn() {
		try {
			await googleSignIn();
			navigate(ROUTES.HOME);
		} catch (error) {
			setClientError(getErrorMessage(error));
		}
	}

	return (
		<>
			<div className="flex gap-5 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Your Company"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=600"
						className="mx-auto h-10 w-auto"
					/>
					<GText className="mt-10 text-center text-2xl/9 font-bold tracking-tight" tag="h2">
						Create your account
					</GText>
				</div>

				<GAlert type="error">{clientError || error}</GAlert>

				<div className="flex flex-col gap-5 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<GInput name="name" label="Full name" required defaultValue="test" />

						<GInput
							name="email"
							label="Email address"
							type="email"
							required
							autoComplete="email"
							defaultValue="test@test.com"
						/>

						<GInput
							name="password"
							label="Password"
							type="password"
							required
							defaultValue="123456"
						/>

						<GButton isLoading={navigation.state === 'submitting'} type="submit">
							Sign in
						</GButton>

						<div className="relative mt-10">
							<div aria-hidden="true" className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm/6 font-medium">
								<span className="bg-white px-6 text-gray-900">Or continue with</span>
							</div>
						</div>

						<GButton
							className="bg-white border border-gray-300"
							color="none"
							isLoading={navigation.state === 'submitting'}
							type="button"
							onClick={handleGoogleSignIn}
						>
							<GoogleIcon />
						</GButton>
					</form>

					<p className=" text-center text-sm/6 text-gray-500">
						Already a member?{' '}
						<NavLink to={ROUTES.LOGIN} className="font-semibold text-blue-600 hover:text-blue-500">
							Sign in
						</NavLink>
					</p>
				</div>
			</div>
		</>
	);
}
