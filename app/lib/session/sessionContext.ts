// Custom hook to use the session context
import { createContext, useContext } from 'react';
import type { Program } from '@/lib/program/program.model';
import type { Session } from '@/lib/session/session.model';

export interface SessionContextType {
	currentSession: Session | null;
	loading: boolean; // true while fetching the current session
	startSession: (program: Program) => void;
	endSession: (programId: Program['id']) => void;
	updateSession?: (session: Session) => void;
	deleteSession?: (session: Session) => void;
}

export const SessionContext = createContext<SessionContextType>({
	currentSession: null,
	loading: true, // default to true while fetching
	startSession: (_program: Program) => {},
	endSession: (_programId: Program['id']) => {},
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
