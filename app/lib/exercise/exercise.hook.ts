import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import type { Exercise } from '@/lib/exercise/exercise.model';
import {
	createExercise,
	deleteExercise,
	getExercises,
	updateExercise,
} from '@/lib/exercise/exercise.repository';
import type { ExerciseContextType } from '@/lib/exercise/exerciseContext';
import { toast } from 'react-toastify';

export function useCRUDExercises(): ExerciseContextType {
	const { user } = useAuth();
	const [exercises, setExercises] = useState<Exercise[]>([]);

	// Fetch exercises with real-time updates
	useEffect(() => {
		if (!user) {
			setExercises([]);
			return;
		}

		const unsubscribe = getExercises(
			user.uid,
			(exercisesData) => setExercises(exercisesData),
			(error) => toast.error(error, { toastId: 'exercise-error' }),
		);

		return () => {
			unsubscribe();
		};
	}, [user]);

	// CRUD operations with shared state
	async function handleCreateExercise(exercise: Exercise) {
		if (!user) {
			toast.error('User must be authenticated', { toastId: 'exercise-error' });
			return;
		}

		try {
			createExercise(user.uid, exercise);
			toast.success(`Exercise "${exercise.name}" created successfully`, {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create exercise', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	function handleUpdateExercise(exercise: Exercise) {
		if (!user) {
			toast.error('User must be authenticated', { toastId: 'exercise-error' });
			return;
		}

		try {
			updateExercise(user.uid, exercise);
			toast.success(`Exercise "${exercise.name}" updated successfully`, {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update exercise', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	function handleDeleteExercise(exerciseId: string) {
		if (!user) {
			toast.error('User must be authenticated', { toastId: 'exercise-error' });
			return;
		}

		try {
			void deleteExercise(user.uid, exerciseId);
			toast.success(`Exercise deleted successfully`, {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete exercise', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	return {
		exercises,
		createExercise: handleCreateExercise,
		updateExercise: handleUpdateExercise,
		deleteExercise: handleDeleteExercise,
	};
}
