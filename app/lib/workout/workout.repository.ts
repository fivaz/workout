import { db } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
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
	limit,
	setDoc,
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

// New function to get workout for specific date
export async function getWorkout(
	userId: string,
	exerciseId: string,
	targetDate: string,
): Promise<Workout> {
	// Try to get the workout for the specific date
	const workoutsRef = collection(db, getWorkoutsPath(userId, exerciseId));
	const exactDateQuery = query(workoutsRef, where('createdAt', '==', targetDate), limit(1));

	const snapshot = await getDocs(exactDateQuery);

	// If workout exists for the target date, return it
	if (!snapshot.empty) {
		const doc = snapshot.docs[0];
		return {
			id: doc.id,
			...doc.data(),
		} as Workout;
	}

	// If no workout exists, get the latest workout and build a new one
	const latestWorkout = await getLatestWorkout(userId, exerciseId, targetDate);
	return buildEmptyWorkout(latestWorkout);
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
	void updateDoc(workoutRef, workout);
}

export function deleteWorkout(userId: string, exerciseId: string, workoutId: string) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workoutId);
	void deleteDoc(workoutRef);
}
