// exercise.service.ts
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import type { Exercise } from '@/lib/exercise/exercise.model';
import {
	createExercise,
	deleteExercise,
	getExercises,
	updateExercise,
} from '@/lib/exercise/exercise.repository';

// Single useExercises Hook
export function useCRUDExercises() {
	const { user } = useAuth();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch exercises with real-time updates
	useEffect(
		function () {
			if (!user) {
				setExercises([]);
				setLoading(false);
				return;
			}

			setLoading(true);
			const unsubscribe = getExercises(
				user.uid,
				(exercisesData) => {
					setExercises(exercisesData);
					setLoading(false);
				},
				(err) => {
					setError(err);
					setLoading(false);
				},
			);

			return function () {
				unsubscribe();
			};
		},
		[user],
	);

	// CRUD operations with shared state
	async function handleCreateExercise(exercise: Exercise) {
		if (!user) {
			setError('User must be authenticated');
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			return await createExercise(user.uid, exercise);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create exercise');
			throw err;
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdateExercise(exercise: Exercise) {
		if (!user) {
			setError('User must be authenticated');
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			await updateExercise(user.uid, exercise);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update exercise');
			throw err;
		} finally {
			setLoading(false);
		}
	}

	async function handleDeleteExercise(exerciseId: string) {
		if (!user) {
			setError('User must be authenticated');
			throw new Error('User must be authenticated');
		}

		setLoading(true);
		try {
			await deleteExercise(user.uid, exerciseId);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete exercise');
			throw err;
		} finally {
			setLoading(false);
		}
	}

	return {
		exercises,
		loading,
		error,
		createExercise: handleCreateExercise,
		updateExercise: handleUpdateExercise,
		deleteExercise: handleDeleteExercise,
	};
}
