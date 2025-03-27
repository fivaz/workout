import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
import {
	createWorkout,
	deleteWorkout,
	getLatestWorkout,
	updateWorkout,
} from '@/lib/workout/workout.repository';

export function useCRUDWorkouts(exerciseId: string, currentDate: string) {
	const { user } = useAuth();
	const [latestWorkout, setLatestWorkout] = useState<Workout>(buildEmptyWorkout());
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Fetch or create the latest workout
	useEffect(() => {
		async function fetchLatestWorkout() {
			if (!user || !exerciseId) {
				setLatestWorkout(buildEmptyWorkout());
				setLoading(false);
				return;
			}

			setLoading(true);
			try {
				const workout = await getLatestWorkout(user.uid, exerciseId, currentDate);
				setLatestWorkout(workout);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch or create latest workout');
			} finally {
				setLoading(false);
			}
		}

		fetchLatestWorkout();
	}, [user, exerciseId, currentDate]);

	// CRUD operations with shared state
	async function handleCreateWorkout(workout: Omit<Workout, 'id'>) {
		if (!user || !exerciseId) {
			setError('User must be authenticated and exercise ID must be provided');
			return;
		}

		setLoading(true);
		try {
			const newWorkoutId = await createWorkout(user.uid, exerciseId, workout);
			setSuccess('Workout created successfully');
			return newWorkoutId; // Return the ID for potential use
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create workout');
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdateWorkout(workout: Workout) {
		if (!user || !exerciseId) {
			setError('User must be authenticated and exercise ID must be provided');
			return;
		}

		setLoading(true);
		try {
			await updateWorkout(user.uid, exerciseId, workout);
			setSuccess('Workout updated successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update workout');
		} finally {
			setLoading(false);
		}
	}

	async function handleDeleteWorkout(workoutId: string) {
		if (!user || !exerciseId) {
			setError('User must be authenticated and exercise ID must be provided');
			return;
		}

		setLoading(true);
		try {
			await deleteWorkout(user.uid, exerciseId, workoutId);
			setSuccess('Workout deleted successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete workout');
		} finally {
			setLoading(false);
		}
	}

	return {
		latestWorkout,
		loading,
		error,
		success,
		createWorkout: handleCreateWorkout,
		updateWorkout: handleUpdateWorkout,
		deleteWorkout: handleDeleteWorkout,
	};
}
