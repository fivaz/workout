import { type ReactNode, useEffect, useState } from 'react';
import AuthContext from './authContext';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { UserModel } from '@/lib/auth/user.model';
import { auth } from '@/lib/firebase.client';
import { ROUTES } from '@/lib/consts';
import { useNavigate } from 'react-router';

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserModel | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
			if (!user?.uid) {
				navigate(ROUTES.LOGIN);
			}

			setUser(
				user
					? {
							photoURL: user.photoURL,
							displayName: user.displayName,
							email: user.email,
							uid: user.uid,
						}
					: null,
			);
		});
		return () => unsubscribe();
	}, [navigate]);

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
