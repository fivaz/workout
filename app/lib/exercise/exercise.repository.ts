import { useState, useEffect } from 'react';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore';
import {
	collection,
	doc,
	getDocs,
	getDoc,
	setDoc,
	addDoc,
	updateDoc,
	deleteDoc,
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
			setLoading(false);
			return;
		}

		const fetchExercises = async () => {
			try {
				const exercisesRef = collection(db, getExercisePath(user.uid));
				const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(exercisesRef);
				const exercisesData = querySnapshot.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						}) as Exercise,
				);
				setExercises(exercisesData);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
			} finally {
				setLoading(false);
			}
		};

		fetchExercises();
	}, [user]);

	return { exercises, loading, error };
}

// Hook for creating an exercise
export function useCreateExercise() {
	const { user } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const createExercise = async (exerciseData: Omit<Exercise, 'id' | 'createdAt'>) => {
		if (!user) {
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			const exercisesRef = collection(db, getExercisePath(user.uid));
			const newExercise = {
				...exerciseData,
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
