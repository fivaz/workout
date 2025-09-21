import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import { buildEmptySession, type Session } from '@/lib/session/session.model';
import {
	createSession,
	deleteSession,
	getSessionByProgramAndDate,
	getSessions,
	updateSession,
} from '@/lib/session/session.repository';
import type { SessionContextType } from '@/lib/session/sessionContext';
import { toast } from 'react-toastify';
import type { Program } from '@/lib/program/program.model';
import { gFormatDate } from '@/lib/consts';

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
	async function handleCreateSession(program: Program): Promise<Session | null> {
		if (!user) {
			toast.error('User must be authenticated');
			return null;
		}

		try {
			// Check if session exists today
			let session = await getSessionByProgramAndDate(user.uid, program.id, gFormatDate(new Date()));

			if (!session) {
				// Create a new session
				session = await createSession(user.uid, buildEmptySession(program));
			}

			return session;
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
	async function handleGetSession(programId: string): Promise<Session | null> {
		if (!user) {
			toast.error('User must be authenticated');
			return null;
		}
		try {
			return await getSessionByProgramAndDate(user.uid, programId, gFormatDate(new Date()));
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to get session';
			toast.error(message);
			console.error(err);
			return null;
		}
	}

	return {
		sessions,
		getSession: handleGetSession,
		createSession: handleCreateSession,
		updateSession: handleUpdateSession,
		deleteSession: handleDeleteSession,
	};
}
