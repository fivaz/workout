import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	updateDoc,
	writeBatch,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
import type { Exercise } from '@/lib/exercise/exercise.model';

export const getExercisePath = (userId: string) => `${DB.USERS}/${userId}/${DB.EXERCISES}`;

// Get real-time exercise updates
export function getExercises(
	userId: string,
	callback: (exercises: Exercise[]) => void,
	onError: (error: string) => void,
) {
	const exercisesRef = query(collection(db, getExercisePath(userId)), orderBy('order'));
	// const exercisesRef = collection(db, getExercisePath(userId));

	return onSnapshot(
		exercisesRef,
		(snapshot) => {
			const exercisesData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Exercise[];
			callback(exercisesData);
		},
		(err) => onError(err.message),
	);
}

export async function createExercise(
	userId: string,
	exercise: Omit<Exercise, 'id'>,
	imageFile: File | null,
): Promise<Exercise> {
	const exercisesRef = collection(db, getExercisePath(userId));
	const newDocRef = doc(exercisesRef);

	let imageUrl = '';
	if (imageFile) {
		imageUrl = await uploadExerciseImage(userId, newDocRef.id, imageFile);
	}

	const newExercise: Exercise = {
		...exercise,
		id: newDocRef.id,
		image: imageUrl,
		createdAt: gFormatDate(new Date()),
	};

	void setDoc(newDocRef, newExercise);
	return newExercise;
}

export async function updateExercise(
	userId: string,
	exercise: Exercise,
	imageFile: File | null,
): Promise<void> {
	let imageUrl = exercise.image;

	if (imageFile) {
		// Upload new image
		imageUrl = await uploadExerciseImage(userId, exercise.id, imageFile);
	}

	const exerciseRef = doc(db, getExercisePath(userId), exercise.id);
	void updateDoc(exerciseRef, {
		...exercise,
		image: imageUrl,
	});
}

export async function updateExercises(userId: string, exercises: Exercise[]): Promise<void> {
	const batch = writeBatch(db);

	exercises.forEach((exercise) => {
		const taskRef = doc(db, getExercisePath(userId), exercise.id);
		batch.update(taskRef, exercise);
	});

	return batch.commit();
}

export async function updateExercisesOrder(userId: string, exercises: Exercise[]): Promise<void> {
	const updatedExercises = exercises.map<Exercise>((exercise, index) => ({
		...exercise,
		order: index,
	}));

	return updateExercises(userId, updatedExercises);
}

function attachProgramAndOrder(exercise: Exercise, programId: string, order: number): Exercise {
	return {
		...exercise,
		programsIds: exercise.programsIds.includes(programId)
			? exercise.programsIds
			: [...exercise.programsIds, programId],
		order,
	};
}

export async function addExercisesToProgram(
	userId: string,
	exercises: Exercise[],
	programId: string,
): Promise<void> {
	const updatedExercises = exercises.map((ex, i) => attachProgramAndOrder(ex, programId, i));
	return updateExercises(userId, updatedExercises);
}

function detachProgramAndOrder(exercise: Exercise, programId: string, order: number): Exercise {
	return {
		...exercise,
		programsIds: exercise.programsIds.includes(programId)
			? exercise.programsIds.filter((id) => id !== programId)
			: exercise.programsIds,
		order,
	};
}

export async function removeExercisesFromProgram(
	userId: string,
	exercises: Exercise[],
	programId: string,
): Promise<void> {
	const updatedExercises = exercises.map((ex, i) => detachProgramAndOrder(ex, programId, i));
	return updateExercises(userId, updatedExercises);
}
// Delete exercise and its associated image
export function deleteExercise(userId: string, exercise: Exercise): void {
	const exerciseRef = doc(db, getExercisePath(userId), exercise.id);

	// Delete associated image if it exists
	if (exercise.image) {
		void deleteImageByUrl(exercise.image);
	}

	void deleteDoc(exerciseRef);
}

// Storage helper functions
async function uploadExerciseImage(
	userId: string,
	exerciseId: string,
	file: File,
): Promise<string> {
	const storageRef = ref(storage, `${getExercisePath(userId)}/${exerciseId}`);
	await uploadBytes(storageRef, file);
	return await getDownloadURL(storageRef);
}

function deleteImageByUrl(imageUrl: string): void {
	try {
		const imageRef = ref(storage, extractPathFromStorageUrl(imageUrl));
		void deleteObject(imageRef);
	} catch (error) {
		console.warn('Failed to delete image:', error);
	}
}

function extractPathFromStorageUrl(url: string): string {
	const matches = url.match(/o\/(.+?)\?/);
	if (!matches?.[1]) throw new Error('Invalid storage URL format');
	return decodeURIComponent(matches[1]);
}
