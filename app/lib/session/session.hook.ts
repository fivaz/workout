import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import { buildEmptySession, type Session } from '@/lib/session/session.model';
import {
	createSession,
	deleteSession,
	getSessionByProgramAndDate,
	getOngoingSession,
	updateSession,
} from '@/lib/session/session.repository';
import type { SessionContextType } from '@/lib/session/sessionContext';
import { toast } from 'react-toastify';
import type { Program } from '@/lib/program/program.model';
import { gFormatDate, gFormatTime } from '@/lib/consts';

export function useCRUDSessions(): SessionContextType {
	const { user } = useAuth();
	const [currentSession, setCurrentSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch the ongoing session once on mount or when the user changes
	useEffect(() => {
		if (!user) {
			setCurrentSession(null);
			setLoading(false);
			return;
		}

		const fetchOngoing = async () => {
			setLoading(true);
			const ongoing = await getOngoingSession(user.uid);
			setCurrentSession(ongoing);
			setLoading(false);
		};

		void fetchOngoing();
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
				// Reset endAt to continue the session
				await updateSession(user.uid, { ...session, endAt: '' });
				setCurrentSession({ ...session, endAt: '' });
			} else {
				// Create a new session
				const newSession = await createSession(user.uid, buildEmptySession(program));
				setCurrentSession(newSession);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to start session';
			toast.error(message);
			console.error(err);
		}
	}

	// End existing session
	async function handleEndSession(programId: Program['id']): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			const session = await getSessionByProgramAndDate(
				user.uid,
				programId,
				gFormatDate(new Date()),
			);

			if (!session) {
				toast.error("This session wasn't started");
				return;
			}

			await updateSession(user.uid, { ...session, endAt: gFormatTime(new Date()) });

			// Clear currentSession if it was the one just ended
			if (currentSession?.id === session.id) {
				setCurrentSession(null);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to end session';
			toast.error(message);
			console.error(err);
		}
	}

	// Update session
	async function handleUpdateSession(session: Session): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await updateSession(user.uid, session);

			// If updating the ongoing session, keep state in sync
			if (currentSession?.id === session.id) {
				setCurrentSession(session);
			}

			toast.success('Session updated successfully');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update session';
			toast.error(message);
			console.error(err);
		}
	}

	// Delete session
	async function handleDeleteSession(session: Session): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await deleteSession(user.uid, session);

			if (currentSession?.id === session.id) {
				setCurrentSession(null);
			}

			toast.success('Session deleted successfully');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete session';
			toast.error(message);
			console.error(err);
		}
	}

	return {
		currentSession,
		startSession: handleStartSession,
		endSession: handleEndSession,
		updateSession: handleUpdateSession,
		deleteSession: handleDeleteSession,
		loading,
	};
}
