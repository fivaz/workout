import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
import {
	createWorkout,
	deleteWorkout,
	getWorkout,
	updateWorkout,
} from '@/lib/workout/workout.repository'; // Updated import path
import { toast } from 'react-toastify';

export function useCRUDWorkouts(exerciseId: string, currentDate: string) {
	const { user } = useAuth();
	const [latestWorkout, setLatestWorkout] = useState<Workout>(buildEmptyWorkout());

	// Fetch the latest workout
	useEffect(() => {
		async function fetchWorkout() {
			if (!user || !exerciseId) {
				setLatestWorkout(buildEmptyWorkout());
				return;
			}

			try {
				const workout = await getWorkout(user.uid, exerciseId, currentDate);
				setLatestWorkout(workout);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'Failed to fetch latest workout', {
					toastId: 'exercise-error',
				});
				console.error(err);
			}
		}

		void fetchWorkout();
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

	async function handleUpdateWorkout(workout: Workout) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			if (workout.id) {
				return updateWorkout(user.uid, exerciseId, workout);
			} else {
				void createWorkout(user.uid, exerciseId, workout);
			}
			// toast.success('Workout updated successfully', {
			// 	toastId: 'exercise-success',
			// });
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
		setLatestWorkout,
		createWorkout: handleCreateWorkout,
		updateWorkout: handleUpdateWorkout,
		deleteWorkout: handleDeleteWorkout,
	};
}
