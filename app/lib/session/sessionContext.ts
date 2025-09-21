// Custom hook to use the session context
import { createContext, useContext } from 'react';
import type { Session } from '@/lib/session/session.model';
import type { Program } from '@/lib/program/program.model';

// Define the context type
export interface SessionContextType {
	sessions: Session[];
	getSession: (programId: string) => Promise<Session | null>;
	createSession: (program: Program) => void;
	updateSession: (session: Session) => void;
	deleteSession: (session: Session) => void;
}

// Create the context
export const SessionContext = createContext<SessionContextType>({
	sessions: [],
	getSession: async (_programId: string) => null,
	createSession: (_program: Program) => {},
	updateSession: (_session: Session) => {},
	deleteSession: (_session: Session) => {},
});

export function useSessions() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error('useSessions must be used within an SessionProvider');
	}
	return context;
}
