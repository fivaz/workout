import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
import type { Program } from '@/lib/program/program.model';

export const getProgramPath = (userId: string) => `${DB.USERS}/${userId}/${DB.PROGRAMS}`;

// Get real-time program updates
export function getPrograms(
	userId: string,
	callback: (programs: Program[]) => void,
	onError: (error: string) => void,
) {
	const programsRef = collection(db, getProgramPath(userId));
	return onSnapshot(
		programsRef,
		(snapshot) => {
			const programsData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Program[];
			callback(programsData);
		},
		(err) => onError(err.message),
	);
}

// Create new program with optional image
export async function createProgram(
	userId: string,
	program: Omit<Program, 'id'>,
): Promise<Program> {
	const programsRef = collection(db, getProgramPath(userId));
	const newDocRef = doc(programsRef);

	const newProgram: Program = {
		...program,
		id: newDocRef.id,
		createdAt: gFormatDate(new Date()),
	};

	void setDoc(newDocRef, newProgram);
	return newProgram;
}

// Update existing program with optional new image
export async function updateProgram(userId: string, program: Program): Promise<void> {
	const programRef = doc(db, getProgramPath(userId), program.id);

	void updateDoc(programRef, program);
}

// Delete program and its associated image
export function deleteProgram(userId: string, program: Program): void {
	const programRef = doc(db, getProgramPath(userId), program.id);

	void deleteDoc(programRef);
}
