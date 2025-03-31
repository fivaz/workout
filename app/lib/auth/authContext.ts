import { createContext } from 'react';
import type { UserModel } from '@/lib/auth/user.model';

export interface AuthContextType {
	user: UserModel | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export default AuthContext;
