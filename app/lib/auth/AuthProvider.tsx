import { type ReactNode, useContext, useEffect, useState } from 'react';
import AuthContext from './authContext';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { UserModel } from '@/lib/auth/user.model';
import { auth } from '@/lib/firebase.client';

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserModel | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
			console.log('x');
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

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
