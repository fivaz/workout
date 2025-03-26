import { adminDb } from '@/lib/firebase.server';
import { type Exercise } from '@/routes/auth/exercise/model';
import { DB } from '@/lib/consts';

function getExercisePath(userId: string) {
	return `/${DB.USERS}/${userId}/${DB.EXERCISES}/`;
}

export function buildExercise(userId: string, formData: FormData): Omit<Exercise, 'updatedAt'> {
	const id = (formData.get('id') as string) || adminDb.collection(getExercisePath(userId)).doc().id;

	return {
		id,
		name: formData.get('name') as string,
	};
}

export async function getExercises(userId: string) {
	const exercisesRef = adminDb.collection(getExercisePath(userId));
	const snapshot = await exercisesRef.get();

	return snapshot.docs.map(
		(doc) =>
			({
				id: doc.id,
				...doc.data(),
			}) as unknown as Exercise,
	);
}

export async function updateExercise(userId: string, formData: FormData) {
	try {
		const exercise = buildExercise(userId, formData);
		const exercisesRef = adminDb.collection(getExercisePath(userId)).doc(exercise.id);

		await exercisesRef.set({ ...exercise, updatedAt: new Date().toISOString() }, { merge: true });

		console.log(`Exercise with ID: ${exercise.id} successfully updated for user: ${userId}`);
	} catch (error) {
		console.error(`Error updating exercise with ID for user: ${userId}`, error);
		throw error; // Re-throw the error to be handled by the caller if needed
	}
}
export async function deleteExercise(userId: string, id: string) {
	try {
		const exercisePath = getExercisePath(userId);
		const exerciseRef = adminDb.collection(exercisePath).doc(id);

		await exerciseRef.delete();
		console.log(`Exercise with ID: ${id} successfully deleted for user: ${userId}`);
	} catch (error) {
		console.error(`Error deleting exercise with ID: ${id} for user: ${userId}`, error);
		throw error;
	}
}
