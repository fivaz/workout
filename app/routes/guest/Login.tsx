import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { NavLink, useNavigate } from 'react-router';
import GoogleIcon from './GoogleIcon';
import { type FormEvent, useState } from 'react';
import GAlert from '@/components/GAlert';
import { ROUTES } from '@/lib/consts';
import { getErrorMessage, googleSignIn, login } from '@/routes/guest/service';
import Logo from '@/components/Logo';

export default function Login() {
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		try {
			await login(event);
			navigate(ROUTES.HOME);
		} catch (error) {
			setError(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		setIsLoading(true);
		try {
			await googleSignIn();
			navigate(ROUTES.HOME);
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
					<Logo className="mx-auto h-10 w-auto" />
					<GText className="mt-10 text-center text-2xl/9 font-bold tracking-tight" tag="h2">
						Sign in to your account
					</GText>
				</div>

				<GAlert type="error" setError={setError}>
					{error}
				</GAlert>

				<div className="flex flex-col gap-5 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit} method="post">
						<GInput name="email" label="Email address" type="email" required autoComplete="email" />

						<GInput name="password" label="Password" type="password" required />

						<GButton className="w-full" isLoading={isLoading} type="submit">
							Sign in
						</GButton>
					</form>

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
						color="white"
						isLoading={isLoading}
						type="button"
						onClick={handleGoogleSignIn}
					>
						<GoogleIcon />
					</GButton>

					<p className=" text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<NavLink
							to={ROUTES.REGISTER}
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
