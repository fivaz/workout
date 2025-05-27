import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import type { Exercise } from '@/lib/exercise/exercise.model';
import {
	createExercise,
	deleteExercise,
	getExercises,
	updateExercise,
	updateExercisesOrder,
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

		getExercises(
			user.uid,
			(exercisesData) => setExercises(exercisesData),
			(error) => toast.error(error, { toastId: 'exercise-error' }),
		);
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

	// Update exercises order
	async function handleUpdateExercisesOrder(exercises: Exercise[]): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await updateExercisesOrder(user.uid, exercises);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update exercise';
			toast.error(message);
			console.error(err);
		}
	}

	// Delete exercise
	function handleDeleteExercise(exercise: Exercise): void {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			void deleteExercise(user.uid, exercise);
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
		updateExercisesOrder: handleUpdateExercisesOrder,
		deleteExercise: handleDeleteExercise,
	};
}
