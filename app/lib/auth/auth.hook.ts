import { useContext } from 'react';
import AuthContext, { type AuthContextType } from '@/lib/auth/authContext';

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
