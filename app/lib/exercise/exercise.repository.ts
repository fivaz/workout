import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
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
	const exercisesRef = collection(db, getExercisePath(userId));
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

// Create new exercise with optional image
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

// Update existing exercise with optional new image
export async function updateExercise(
	userId: string,
	exercise: Exercise,
	imageFile: File | null,
): Promise<void> {
	let imageUrl = exercise.image;

	if (imageFile) {
		// Upload new image
		imageUrl = await uploadExerciseImage(userId, exercise.id, imageFile);

		// Delete old image if it existed
		if (exercise.image) {
			await deleteImageByUrl(exercise.image);
		}
	}

	const exerciseRef = doc(db, getExercisePath(userId), exercise.id);
	void updateDoc(exerciseRef, {
		...exercise,
		image: imageUrl,
	});
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
