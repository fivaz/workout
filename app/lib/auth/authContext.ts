import { createContext, useContext } from 'react';
import type { UserModel } from '@/lib/auth/user.model';

interface AuthContextType {
	user: UserModel | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export default AuthContext;

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
