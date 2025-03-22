import { type ReactNode, useEffect, useState } from 'react';
import AuthContext from './authContext';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { AuthUser } from '@/lib/auth/authUser';
import { auth } from '@/lib/firebase.client';

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
			setUser(
				user
					? {
							displayName: user.displayName,
							email: user.email,
							uid: user.uid,
						}
					: null,
			);
		});
		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
