import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	setDoc,
	updateDoc,
	query,
	where,
	getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB } from '@/lib/consts';
import type { Session } from '@/lib/session/session.model';

export const getSessionPath = (userId: string) => `${DB.USERS}/${userId}/${DB.SESSIONS}`;

// Get real-time session updates
export function getSessions(
	userId: string,
	callback: (sessions: Session[]) => void,
	onError: (error: string) => void,
) {
	const sessionsRef = collection(db, getSessionPath(userId));
	return onSnapshot(
		sessionsRef,
		(snapshot) => {
			const sessionsData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Session[];
			callback(sessionsData);
		},
		(err) => onError(err.message),
	);
}

// Get sessions for a specific program on a specific date (optional helper)
export async function getSessionByProgramAndDate(
	userId: string,
	programId: string,
	date: string,
): Promise<Session | null> {
	const sessionsRef = collection(db, getSessionPath(userId));
	const q = query(sessionsRef, where('programId', '==', programId), where('date', '==', date));
	const snapshot = await getDocs(q);
	if (snapshot.empty) return null;
	const docData = snapshot.docs[0].data() as Session;
	return { ...docData, id: snapshot.docs[0].id };
}

// Create new session
export async function createSession(
	userId: string,
	session: Omit<Session, 'id'>,
): Promise<Session> {
	const sessionsRef = collection(db, getSessionPath(userId));
	const newDocRef = doc(sessionsRef);

	const newSession: Session = {
		...session,
		id: newDocRef.id,
	};

	void setDoc(newDocRef, newSession);
	return newSession;
}

// Update existing session
export async function updateSession(userId: string, session: Session): Promise<void> {
	const sessionRef = doc(db, getSessionPath(userId), session.id);
	void updateDoc(sessionRef, session);
}

// Delete session
export function deleteSession(userId: string, session: Session): void {
	const sessionRef = doc(db, getSessionPath(userId), session.id);
	void deleteDoc(sessionRef);
}
