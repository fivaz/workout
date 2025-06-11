import { db } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';

// Base path generator
export const getWorkoutsPath = (userId: string, exerciseId: string) =>
	`${DB.USERS}/${userId}/${DB.EXERCISES}/${exerciseId}/${DB.WORKOUTS}`;

export async function getLatestWorkout(
	userId: string,
	exerciseId: string,
	currentDate: string,
): Promise<Workout> {
	const workoutsRef = collection(db, getWorkoutsPath(userId, exerciseId));
	const q = query(
		workoutsRef,
		where('createdAt', '<=', currentDate),
		orderBy('createdAt', 'desc'),
		limit(1), // Get only the most recent workout
	);
	const snapshot = await getDocs(q);

	if (snapshot.empty) {
		return buildEmptyWorkout();
	}

	const latestDoc = snapshot.docs[0];
	return {
		id: latestDoc.id,
		...latestDoc.data(),
	} as Workout;
}

export function getWorkout(
	userId: string,
	exerciseId: string,
	targetDate: string,
	callback: (workout: Workout) => void,
): () => void {
	const workoutsRef = collection(db, getWorkoutsPath(userId, exerciseId));
	const exactDateQuery = query(workoutsRef, where('createdAt', '==', targetDate), limit(1));

	return onSnapshot(exactDateQuery, async (snapshot) => {
		if (!snapshot.empty) {
			const doc = snapshot.docs[0];
			callback({
				id: doc.id,
				...doc.data(),
			} as Workout);
		} else {
			const latestWorkout = await getLatestWorkout(userId, exerciseId, targetDate);
			callback(buildEmptyWorkout(latestWorkout));
		}
	});
}

// CRUD Functions
export function getWorkouts(
	userId: string,
	exerciseId: string,
	callback: (workouts: Workout[]) => void,
	onError: (error: string) => void,
) {
	const workoutsRef = collection(db, getWorkoutsPath(userId, exerciseId));
	return onSnapshot(
		workoutsRef,
		(snapshot) => {
			const workoutsData = snapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					}) as Workout,
			);
			callback(workoutsData);
		},
		(err) => {
			onError(err.message);
		},
	);
}

export function createWorkout(userId: string, exerciseId: string, workout: Workout) {
	const workoutsRef = collection(db, getWorkoutsPath(userId, exerciseId));

	const newDocRef = doc(workoutsRef);
	const newWorkout = {
		...workout,
		id: newDocRef.id, // Include the ID in the document
		createdAt: gFormatDate(new Date()),
	};
	void setDoc(newDocRef, newWorkout);
	return newWorkout;
}

export function updateWorkout(userId: string, exerciseId: string, workout: Workout) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workout.id);
	return updateDoc(workoutRef, workout);
}

export function deleteWorkout(userId: string, exerciseId: string, workoutId: string) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workoutId);
	void deleteDoc(workoutRef);
}
