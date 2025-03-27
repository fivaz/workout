import { db } from '../firebase.client';
import { DB } from '@/lib/consts';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	updateDoc,
	getDocs,
	query,
	where,
	orderBy,
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

	// Query workouts where date is <= currentDate, ordered by date descending, limited to 1
	const q = query(
		workoutsRef,
		where('date', '<=', currentDate),
		orderBy('date', 'desc'),
		orderBy('createdAt', 'desc'),
		limit(1),
	);

	const snapshot = await getDocs(q);

	if (snapshot.empty) {
		console.error('there should be a workout for exercise: ', exerciseId);
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

export async function createWorkout(
	userId: string,
	exerciseId: string,
	workout: Omit<Workout, 'id'>,
) {
	const workoutsRef = collection(db, getWorkoutsPath(userId, exerciseId));
	const newWorkout = {
		...workout,
		createdAt: workout.createdAt || new Date().toISOString(),
	};
	const docRef = await addDoc(workoutsRef, newWorkout);
	return docRef.id;
}

export async function updateWorkout(userId: string, exerciseId: string, workout: Workout) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workout.id);
	await updateDoc(workoutRef, workout);
}

export async function deleteWorkout(userId: string, exerciseId: string, workoutId: string) {
	const workoutRef = doc(db, getWorkoutsPath(userId, exerciseId), workoutId);
	await deleteDoc(workoutRef);
}
