import { createCookieSessionStorage } from 'react-router';

type SessionData = {
	userId: string;
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
