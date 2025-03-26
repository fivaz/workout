import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB } from '@/lib/consts';
import type { Exercise } from '@/lib/exercise/exercise.model';

// Base path generator
export const getExercisePath = (userId: string) => `${DB.USERS}/${userId}/${DB.EXERCISES}`;

// CRUD Functions (isolated from hooks)
export function getExercises(
	userId: string,
	callback: (exercises: Exercise[]) => void,
	onError: (error: string) => void,
) {
	const exercisesRef = collection(db, getExercisePath(userId));
	return onSnapshot(
		exercisesRef,
		(snapshot) => {
			const exercisesData = snapshot.docs.map(function (doc) {
				return {
					id: doc.id,
					...doc.data(),
				} as Exercise;
			});
			callback(exercisesData);
		},
		(err) => {
			onError(err.message);
		},
	);
}

export async function createExercise(userId: string, exercise: Exercise) {
	const exercisesRef = collection(db, getExercisePath(userId));
	const { id, ...data } = exercise; // Remove id if provided
	const newExercise = {
		...data,
		createdAt: new Date().toISOString(),
	};
	const docRef = await addDoc(exercisesRef, newExercise);
	return docRef.id;
}

export async function updateExercise(userId: string, exercise: Exercise) {
	const exerciseRef = doc(db, getExercisePath(userId), exercise.id);
	await updateDoc(exerciseRef, exercise);
}

export async function deleteExercise(userId: string, exerciseId: string) {
	const exerciseRef = doc(db, getExercisePath(userId), exerciseId);
	await deleteDoc(exerciseRef);
}
