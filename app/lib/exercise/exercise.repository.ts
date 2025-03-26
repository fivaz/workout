import { useEffect, useState } from 'react';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	type QuerySnapshot,
	updateDoc,
} from 'firebase/firestore';
import { useAuth } from '@/lib/auth/authContext';
import { db } from '../firebase.client';
import { DB } from '@/lib/consts';
import type { Exercise } from '@/lib/exercise/exercise.model';

// Base path generator
const getExercisePath = (userId: string) => `${DB.USERS}/${userId}/${DB.EXERCISES}`;

// Hook for fetching all exercises
export function useGetExercises() {
	const { user } = useAuth();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			setExercises([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const exercisesRef = collection(db, getExercisePath(user.uid));

		// Real-time listener
		const unsubscribe = onSnapshot(
			exercisesRef,
			(snapshot) => {
				const exercisesData = snapshot.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						}) as Exercise,
				);
				setExercises(exercisesData);
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			},
		);

		// Cleanup subscription
		return () => unsubscribe();
	}, [user]);

	return { exercises, loading, error };
}

// Hook for creating an exercise
export function useCreateExercise() {
	const { user } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const createExercise = async (exercise: Exercise) => {
		if (!user) {
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			const exercisesRef = collection(db, getExercisePath(user.uid));
			// remove id
			const { id, ...data } = exercise;
			const newExercise = {
				...data,
				createdAt: new Date().toISOString(),
			};
			const docRef = await addDoc(exercisesRef, newExercise);
			return docRef.id;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create exercise');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { createExercise, loading, error };
}

// Hook for updating an exercise
export function useUpdateExercise() {
	const { user } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const updateExercise = async (exercise: Exercise) => {
		if (!user) {
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			const exerciseRef = doc(db, getExercisePath(user.uid), exercise.id);
			await updateDoc(exerciseRef, exercise);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update exercise');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { updateExercise, loading, error };
}

// Hook for deleting an exercise
export function useDeleteExercise() {
	const { user } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const deleteExercise = async (exerciseId: string) => {
		if (!user) {
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			const exerciseRef = doc(db, getExercisePath(user.uid), exerciseId);
			await deleteDoc(exerciseRef);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete exercise');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { deleteExercise, loading, error };
}
