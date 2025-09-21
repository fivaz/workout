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
import { gFormatDate, gFormatTime } from '@/lib/consts';

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

	// Start a new session
	async function handleStartSession(program: Program): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			// Check if session exists today
			const session = await getSessionByProgramAndDate(
				user.uid,
				program.id,
				gFormatDate(new Date()),
			);

			if (session) {
				// reset session's end field to make it continue
				void updateSession(user.uid, { ...session, endAt: '' });
			} else {
				// Create a new session
				void createSession(user.uid, buildEmptySession(program));
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create session';
			toast.error(message);
			console.error(err);
			return;
		}
	}

	// end existing session
	async function handleEndSession(programId: Program['id']): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		const session = await getSessionByProgramAndDate(user.uid, programId, gFormatDate(new Date()));
		if (!session) {
			toast.error("This session wasn't started");
			return;
		}

		try {
			await updateSession(user.uid, { ...session, endAt: gFormatTime(new Date()) });
			toast.success(`Session updated successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update session';
			toast.error(message);
			console.error(err);
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
		startSession: handleStartSession,
		endSession: handleEndSession,
	};
}
