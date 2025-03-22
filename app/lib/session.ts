import { createCookieSessionStorage } from 'react-router';

export const sessionStorage = createCookieSessionStorage({
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

export async function getSession(request: Request) {
	return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function commitSession(session: Awaited<ReturnType<typeof getSession>>) {
	return sessionStorage.commitSession(session);
}
