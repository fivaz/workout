import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB } from '@/lib/consts';
import type { Set } from '@/lib/set/set.model'; // Assuming you have a Set model

// Base path generator
export const getSetsPath = (userId: string, exerciseId: string) =>
	`${DB.USERS}/${userId}/${DB.EXERCISES}/${exerciseId}/${DB.SETS}`;

// CRUD Functions (isolated from hooks)
export function getSets(
	userId: string,
	exerciseId: string,
	callback: (sets: Set[]) => void,
	onError: (error: string) => void,
) {
	const setsRef = collection(db, getSetsPath(userId, exerciseId));
	return onSnapshot(
		setsRef,
		(snapshot) => {
			const setsData = snapshot.docs.map(function (doc) {
				return {
					id: doc.id,
					...doc.data(),
				} as Set;
			});
			callback(setsData);
		},
		(err) => {
			onError(err.message);
		},
	);
}

export async function createSet(userId: string, exerciseId: string, set: Set) {
	const setsRef = collection(db, getSetsPath(userId, exerciseId));
	const { id, ...data } = set; // Remove id if provided
	const newSet = {
		...data,
		createdAt: new Date().toISOString(),
	};
	const docRef = await addDoc(setsRef, newSet);
	return docRef.id;
}

export async function updateSet(userId: string, exerciseId: string, set: Set) {
	const setRef = doc(db, getSetsPath(userId, exerciseId), set.id);
	await updateDoc(setRef, set);
}

export async function deleteSet(userId: string, exerciseId: string, setId: string) {
	const setRef = doc(db, getSetsPath(userId, exerciseId), setId);
	await deleteDoc(setRef);
}
