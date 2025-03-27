import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
import {
	createWorkout,
	deleteWorkout,
	getLatestWorkout,
	updateWorkout,
} from '@/lib/workout/workout.repository';
import { toast } from 'react-toastify';

export function useCRUDWorkouts(exerciseId: string, currentDate: string) {
	const { user } = useAuth();
	const [latestWorkout, setLatestWorkout] = useState<Workout>(buildEmptyWorkout());

	// Fetch or create the latest workout
	useEffect(() => {
		async function fetchLatestWorkout() {
			if (!user || !exerciseId) {
				setLatestWorkout(buildEmptyWorkout());
				return;
			}

			try {
				const workout = await getLatestWorkout(user.uid, exerciseId, currentDate);
				setLatestWorkout(workout);
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : 'Failed to fetch or create latest workout',
					{ toastId: 'exercise-error' },
				);
				console.error(err);
			}
		}

		void fetchLatestWorkout();
	}, [user, exerciseId, currentDate]);

	// CRUD operations with shared state
	function handleCreateWorkout(workout: Workout) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			void createWorkout(user.uid, exerciseId, workout);
			toast.success('Workout created successfully', {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create workout', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	function handleUpdateWorkout(workout: Workout) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			void updateWorkout(user.uid, exerciseId, workout);
			toast.success('Workout updated successfully', {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update workout', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	function handleDeleteWorkout(workoutId: string) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			void deleteWorkout(user.uid, exerciseId, workoutId);
			toast.success('Workout deleted successfully', {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete workout', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	return {
		latestWorkout,
		createWorkout: handleCreateWorkout,
		updateWorkout: handleUpdateWorkout,
		deleteWorkout: handleDeleteWorkout,
	};
}
