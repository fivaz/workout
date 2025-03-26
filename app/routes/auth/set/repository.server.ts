import { adminDb } from '@/lib/firebase.server';
import { type Set } from '@/routes/auth/set/model';
import { DB } from '@/lib/consts';
import { getExercisePath } from '@/routes/auth/exercise/repository.server';

export function getSetPath(userId: string, exerciseId: string) {
	return `${getExercisePath(userId)}/${exerciseId}/${DB.SETS}`;
}

export function buildSet(userId: string, exerciseId: string, formData: FormData): Set {
	const id =
		(formData.get('id') as string) || adminDb.collection(getSetPath(userId, exerciseId)).doc().id;

	return {
		id,
		weight: Number(formData.get('weight')),
		reps: Number(formData.get('reps')),
		date: formData.get('date') as string,
	};
}

export async function updateSet(userId: string, exerciseId: string, formData: FormData) {
	try {
		const set = buildSet(userId, exerciseId, formData);
		const setsRef = adminDb.collection(getSetPath(userId, exerciseId)).doc(set.id);

		await setsRef.set(set, { merge: true }); // Use merge: true to update if exists, create if not
		console.log(
			`Set with ID: ${set.id} successfully added/updated for exercise: ${exerciseId}, user: ${userId}`,
		);
	} catch (error) {
		console.error(`Error adding/updating set for exercise: ${exerciseId}, user: ${userId}`, error);
		throw error;
	}
}

export async function deleteSet(userId: string, exerciseId: string, setId: string) {
	try {
		const exercisePath = getSetPath(userId, exerciseId);
		const exerciseRef = adminDb.collection(exercisePath).doc(setId);

		await exerciseRef.delete();
		console.log(`Set with ID: ${setId} successfully deleted for user: ${userId}`);
	} catch (error) {
		console.error(`Error deleting set with ID: ${setId} for user: ${userId}`, error);
		throw error;
	}
}
