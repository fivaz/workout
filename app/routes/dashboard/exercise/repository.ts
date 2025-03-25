import { adminDb } from '@/lib/firebase.server';
import type { Exercise } from '@/routes/dashboard/exercise/model';
import { DB } from '@/lib/consts';

export async function getExercises(userId: string) {
	const exercisesRef = adminDb.collection(DB.USERS).doc(userId).collection(DB.EXERCISES);
	const snapshot = await exercisesRef.get();

	return snapshot.docs.map(
		(doc) =>
			({
				id: doc.id,
				...doc.data(),
			}) as unknown as Exercise,
	);
}
