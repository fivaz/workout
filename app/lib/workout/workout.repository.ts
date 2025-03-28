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
		where('date', '<=', currentDate),
		orderBy('date', 'desc'),
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
	const { id, ...data } = workout;
	const newWorkout = {
		...data,
		date: workout.date || gFormatDate(new Date()),
	};
	void addDoc(workoutsRef, newWorkout);
}

export function updateWorkout(userId: string, exerciseId: string, workout: Workout) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workout.id);
	void updateDoc(workoutRef, workout);
}

export function deleteWorkout(userId: string, exerciseId: string, workoutId: string) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workoutId);
	void deleteDoc(workoutRef);
}
