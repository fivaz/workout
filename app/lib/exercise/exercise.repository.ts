import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
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

export function createExercise(userId: string, exercise: Exercise): Exercise {
	const exercisesRef = collection(db, getExercisePath(userId));

	// Generate a new document reference with a unique ID
	const newDocRef = doc(exercisesRef);

	// Prepare the exercise data with the generated ID
	const newExercise = {
		...exercise,
		id: newDocRef.id, // Include the ID in the document
		createdAt: gFormatDate(new Date()),
	};

	// Write the document to Firestore with the pre-generated ID
	void setDoc(newDocRef, newExercise);

	return newExercise;
}

export function updateExercise(userId: string, exercise: Exercise) {
	const exerciseRef = doc(db, getExercisePath(userId), exercise.id);
	void updateDoc(exerciseRef, exercise);
}

export function deleteExercise(userId: string, exerciseId: string) {
	const exerciseRef = doc(db, getExercisePath(userId), exerciseId);
	void deleteDoc(exerciseRef);
}
