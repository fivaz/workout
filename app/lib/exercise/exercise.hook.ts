import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import type { Exercise } from '@/lib/exercise/exercise.model';
import {
	createExercise,
	deleteExercise,
	getExercises,
	updateExercise,
} from '@/lib/exercise/exercise.repository';

export function useCRUDExercises() {
	const { user } = useAuth();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null); // New success state

	// Fetch exercises with real-time updates
	useEffect(() => {
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

		return () => {
			unsubscribe();
		};
	}, [user]);

	// CRUD operations with shared state
	async function handleCreateExercise(exercise: Exercise) {
		if (!user) {
			setError('User must be authenticated');
			return;
		}

		setLoading(true);
		try {
			const newExercise = await createExercise(user.uid, exercise);
			setSuccess(`Exercise "${exercise.name}" created successfully`);
			return newExercise;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create exercise');
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdateExercise(exercise: Exercise) {
		if (!user) {
			setError('User must be authenticated');
			return;
		}

		setLoading(true);
		try {
			await updateExercise(user.uid, exercise);
			setSuccess(`Exercise "${exercise.name}" updated successfully`);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update exercise');
		} finally {
			setLoading(false);
		}
	}

	async function handleDeleteExercise(exerciseId: string) {
		if (!user) {
			setError('User must be authenticated');
			return;
		}

		setLoading(true);
		try {
			await deleteExercise(user.uid, exerciseId);
			setSuccess('Exercise deleted successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete exercise');
		} finally {
			setLoading(false);
		}
	}

	return {
		exercises,
		loading,
		error,
		success,
		createExercise: handleCreateExercise,
		updateExercise: handleUpdateExercise,
		deleteExercise: handleDeleteExercise,
	};
}
