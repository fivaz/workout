import {
	collection,
	deleteDoc,
	doc,
	setDoc,
	updateDoc,
	query,
	where,
	getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB } from '@/lib/consts';
import { type Session } from '@/lib/session/session.model';

export const getSessionPath = (userId: string) => `${DB.USERS}/${userId}/${DB.SESSIONS}`;

// Get the ongoing session (endAt === '') for the user
export async function getOngoingSession(userId: string): Promise<Session | null> {
	try {
		const sessionsRef = collection(db, getSessionPath(userId));
		const q = query(sessionsRef, where('endAt', '==', '')); // only unfinished sessions
		const snapshot = await getDocs(q);

		if (snapshot.empty) return null;

		const docData = snapshot.docs[0].data() as Session;
		return { ...docData, id: snapshot.docs[0].id };
	} catch (err) {
		console.error('Failed to fetch ongoing session', err);
		return null;
	}
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
	return updateDoc(sessionRef, session);
}

// Delete session
export async function deleteSession(userId: string, session: Session): Promise<void> {
	const sessionRef = doc(db, getSessionPath(userId), session.id);
	return deleteDoc(sessionRef);
}
