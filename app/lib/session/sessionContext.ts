// Custom hook to use the session context
import { createContext, useContext } from 'react';
import type { Session } from '@/lib/session/session.model';

// Define the context type
export interface SessionContextType {
	sessions: Session[];
	createSession: (session: Omit<Session, 'id'>) => Promise<Session | null>;
	updateSession: (session: Session) => void;
	deleteSession: (session: Session) => void;
	getSessionByProgramAndDate: (programId: string, date: string) => Promise<Session | null>;
}

// Create the context
export const SessionContext = createContext<SessionContextType>({
	sessions: [],
	createSession: (_session: Omit<Session, 'id'>) => Promise.resolve(null),
	updateSession: (_session: Session) => {},
	deleteSession: (_session: Session) => {},
	getSessionByProgramAndDate: async () => null,
});

export function useSessions() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error('useSessions must be used within an SessionProvider');
	}
	return context;
}
