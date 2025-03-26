import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { data, NavLink, redirect, useFetcher } from 'react-router';
import GoogleIcon from './GoogleIcon';
import { type FormEvent, useEffect, useState } from 'react';
import GAlert from '@/components/GAlert';
import { adminAuth } from '@/lib/firebase.server';
import { commitSession, getSession } from '@/sessions.server';
import type { Route } from './+types/Login';
import { SERVER_ROUTES } from '@/lib/consts';
import { getErrorMessage, googleSignIn, login } from '@/routes/server/guest/service';

export default function Login() {
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const fetcher = useFetcher();
	const isSubmitting = isLoading || fetcher.state === 'submitting' || fetcher.state === 'loading';

	// Handle fetcher response (success or error)
	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data) {
			if (fetcher.data.error) {
				setError(fetcher.data.error); // Display server-side error
			}
		}
	}, [fetcher.state, fetcher.data]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		try {
			const idToken = await login(event);
			void fetcher.submit({ idToken }, { method: 'post', action: SERVER_ROUTES.LOGIN });
		} catch (error) {
			setError(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		setIsLoading(true);
		try {
			const idToken = await googleSignIn();
			void fetcher.submit({ idToken }, { method: 'post', action: SERVER_ROUTES.LOGIN });
		} catch (error) {
			setError(getErrorMessage(error));
		} finally {
			setIsLoading(false);
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
						Sign in to your account
					</GText>
				</div>

				<GAlert type="error" setError={setError}>
					{error}
				</GAlert>

				<div className="flex flex-col gap-5 sm:mx-auto sm:w-full sm:max-w-sm">
					<fetcher.Form className="space-y-6" onSubmit={handleSubmit} method="post">
						<GInput name="email" label="Email address" type="email" required autoComplete="email" />

						<GInput name="password" label="Password" type="password" required />

						<GButton isLoading={isSubmitting} type="submit">
							Sign in
						</GButton>
					</fetcher.Form>

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
						isLoading={isSubmitting}
						type="button"
						onClick={handleGoogleSignIn}
					>
						<GoogleIcon />
					</GButton>

					<p className=" text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<NavLink
							to={SERVER_ROUTES.REGISTER}
							className="font-semibold text-blue-600 hover:text-blue-500"
						>
							Sign up
						</NavLink>
					</p>
				</div>
			</div>
		</>
	);
}

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	try {
		const formData = await request.formData();
		const idToken = formData.get('idToken')?.toString();

		if (!idToken) {
			return data({ error: 'No ID token provided' }, { status: 400 });
		}

		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
		});

		session.set('sessionCookie', sessionCookie);
		session.set('userId', decodedToken.uid);

		return redirect(SERVER_ROUTES.HOME, {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	} catch (error) {
		session.flash('error', error instanceof Error ? error.message : 'Authentication failed');
		// Redirect back to the login page with errors.
		return redirect(SERVER_ROUTES.LOGIN, {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}
}
