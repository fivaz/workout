// Custom hook to use the session context
import { createContext, useContext } from 'react';
import type { Program } from '@/lib/program/program.model';
import type { Session } from '@/lib/session/session.model';

// Define the context type
export interface SessionContextType {
	currentSession: Session | null;
	startSession: (program: Program) => void;
	endSession: (programId: Program['id']) => void;
}

// Create the context
export const SessionContext = createContext<SessionContextType>({
	currentSession: null,
	startSession: (_program: Program) => {},
	endSession: (_programId: Program['id']) => {},
});

export function useSessions() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error('useSessions must be used within an SessionProvider');
	}
	return context;
}
