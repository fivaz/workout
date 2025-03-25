import { createCookieSessionStorage, redirect } from 'react-router';
import { adminAuth } from '@/lib/firebase.server';

type SessionData = {
	userId: string;
	sessionCookie: string;
};

type SessionFlashData = {
	error: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
	SessionData,
	SessionFlashData
>({
	cookie: {
		name: '__session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		secrets: [process.env.SESSION_SECRET || 's3cret'],
		maxAge: 60 * 60 * 24 * 5, // 5 days
	},
});

export { getSession, commitSession, destroySession };

export async function checkUser(request: Request) {
	try {
		const session = await getSession(request.headers.get('Cookie'));
		const sessionCookie = session.get('sessionCookie');

		if (!sessionCookie) {
			// Redirect to the home page if they are already signed in.
			throw new Response('Unauthorized - No session cookie', { status: 401 });
		}

		const user = await adminAuth.verifySessionCookie(sessionCookie);

		return user.uid;
	} catch (error) {
		console.error('Error verifying session cookie:', error);
		throw new Response('Invalid session cookie', { status: 401 });
	}
}
