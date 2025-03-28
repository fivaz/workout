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

	// Subscribe to real-time exercise updates
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

		return unsubscribe;
	}, [user]);

	// Create new exercise
	async function handleCreateExercise(
		exercise: Omit<Exercise, 'id'>,
		imageFile: File | null,
	): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await createExercise(user.uid, exercise, imageFile);
			toast.success(`"${exercise.name}" created successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create exercise';
			toast.error(message);
			console.error(err);
		}
	}

	// Update existing exercise
	async function handleUpdateExercise(exercise: Exercise, imageFile: File | null): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await updateExercise(user.uid, exercise, imageFile);
			toast.success(`"${exercise.name}" updated successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update exercise';
			toast.error(message);
			console.error(err);
		}
	}

	// Delete exercise
	async function handleDeleteExercise(exercise: Exercise): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await deleteExercise(user.uid, exercise);
			toast.success(`"${exercise.name}" deleted successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete exercise';
			toast.error(message);
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
