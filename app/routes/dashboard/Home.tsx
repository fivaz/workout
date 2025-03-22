import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import { adminAuth } from '@/lib/firebase.server';
import { getSession } from '@/lib/session';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request);
	const sessionCookie = session.get('sessionCookie');

	if (!sessionCookie) {
		return redirect('/login');
	}

	try {
		const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
		return { userId: decodedClaims.uid };
	} catch (error) {
		return redirect('/login');
	}
}

export default function Home() {
	const { userId } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Welcome, {userId}</h1>
		</div>
	);
}
