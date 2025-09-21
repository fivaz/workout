import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import type { Session } from '@/lib/session/session.model';
import {
	createSession,
	deleteSession,
	getSessionByProgramAndDate as repoGetSessionByProgramAndDate,
	getSessions,
	updateSession,
} from '@/lib/session/session.repository';
import type { SessionContextType } from '@/lib/session/sessionContext';
import { toast } from 'react-toastify';

export function useCRUDSessions(): SessionContextType {
	const { user } = useAuth();
	const [sessions, setSessions] = useState<Session[]>([]);

	// Subscribe to real-time session updates
	useEffect(() => {
		if (!user) {
			setSessions([]);
			return;
		}

		const unsubscribe = getSessions(
			user.uid,
			(sessionsData) => setSessions(sessionsData),
			(error) => toast.error(error, { toastId: 'session-error' }),
		);

		return () => unsubscribe();
	}, [user]);

	// Create a new session
	async function handleCreateSession(session: Omit<Session, 'id'>): Promise<Session | null> {
		if (!user) {
			toast.error('User must be authenticated');
			return null;
		}

		try {
			const newSession = await createSession(user.uid, session);
			toast.success(`Session for "${session.programNameSnapshot}" created successfully`);
			return newSession;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create session';
			toast.error(message);
			console.error(err);
			return null;
		}
	}

	// Update existing session
	async function handleUpdateSession(session: Session): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await updateSession(user.uid, session);
			toast.success(`Session updated successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update session';
			toast.error(message);
			console.error(err);
		}
	}

	// Delete a session
	async function handleDeleteSession(session: Session): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			void deleteSession(user.uid, session);
			toast.success(`Session deleted successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete session';
			toast.error(message);
			console.error(err);
		}
	}

	// Get session by program and date
	async function handleGetSessionByProgramAndDate(
		programId: string,
		date: string,
	): Promise<Session | null> {
		if (!user) {
			toast.error('User must be authenticated');
			return null;
		}
		try {
			return await repoGetSessionByProgramAndDate(user.uid, programId, date);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to get session';
			toast.error(message);
			console.error(err);
			return null;
		}
	}

	return {
		sessions,
		createSession: handleCreateSession,
		updateSession: handleUpdateSession,
		deleteSession: handleDeleteSession,
		getSessionByProgramAndDate: handleGetSessionByProgramAndDate,
	};
}
