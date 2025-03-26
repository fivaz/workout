import { adminDb } from '@/lib/firebase.server';
import { buildExercise, type Exercise } from '@/routes/auth/exercise/model';
import { DB } from '@/lib/consts';

function getExercisePath(userId: string) {
	return `/${DB.USERS}/${userId}/${DB.EXERCISES}/`;
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

export async function addExercise(userId: string, formData: FormData) {
	const exercise = buildExercise(formData);

	const exercisesRef = adminDb.collection(getExercisePath(userId));
	await exercisesRef.add(exercise);
}
