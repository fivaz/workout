import { db } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
import { buildEmptyWorkout, type WorkoutSet } from '@/lib/set/set.model';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';

// Base path generator
export const getSetsPath = (userId: string, exerciseId: string) =>
	`${DB.USERS}/${userId}/${DB.EXERCISES}/${exerciseId}/${DB.SETS}`;

export async function getLatestSets(
	userId: string,
	exerciseId: string,
	currentDate: string,
): Promise<WorkoutSet[]> {
	const setsRef = collection(db, getSetsPath(userId, exerciseId));
	const q = query(setsRef, where('date', '<=', currentDate), orderBy('date', 'desc'));
	const snapshot = await getDocs(q);

	if (snapshot.empty) {
		return [];
	}

	return snapshot.docs.map(
		(doc) =>
			({
				id: doc.id,
				...doc.data(),
			}) as WorkoutSet,
	);
}

// CRUD Functions
export function getSets(
	userId: string,
	exerciseId: string,
	callback: (sets: WorkoutSet[]) => void,
	onError: (error: string) => void,
) {
	const setsRef = collection(db, getSetsPath(userId, exerciseId));
	return onSnapshot(
		setsRef,
		(snapshot) => {
			const setsData = snapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					}) as WorkoutSet,
			);
			callback(setsData);
		},
		(err) => {
			onError(err.message);
		},
	);
}

export function createSet(userId: string, exerciseId: string, set: WorkoutSet) {
	const setsRef = collection(db, getSetsPath(userId, exerciseId));
	const { id, ...data } = set;
	const newSet = {
		...data,
		date: set.date || gFormatDate(new Date()),
	};
	void addDoc(setsRef, newSet);
}

export function updateSet(userId: string, exerciseId: string, set: WorkoutSet) {
	const setRef = doc(db, getSetsPath(userId, exerciseId), set.id);
	void updateDoc(setRef, set);
}

export function deleteSet(userId: string, exerciseId: string, setId: string) {
	const setRef = doc(db, getSetsPath(userId, exerciseId), setId);
	void deleteDoc(setRef);
}
