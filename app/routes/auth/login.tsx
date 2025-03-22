import DarkMode from '@/components/DarkMode';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';

export default function Example() {
	return (
		<>
			<DarkMode />
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Your Company"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
						className="mx-auto h-10 w-auto"
					/>
					<GText className="mt-10 text-center text-2xl/9 font-bold tracking-tight" tag="h2">
						Sign in to your account
					</GText>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form action="#" method="POST" className="space-y-6">
						<GInput label="Email address" type="email" required autoComplete="email" />

						<GInput label="Password" type="password" required />

						<GButton type="submit">Sign in</GButton>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
							Sign up
						</a>
					</p>
				</div>
			</div>
		</>
	);
}
