import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import { buildEmptyWorkout, type Workout } from '@/lib/workout/workout.model';
import { deleteWorkout, getWorkout, updateWorkout } from '@/lib/workout/workout.repository';
import { toast } from 'react-toastify';

export function useCRUDWorkouts(exerciseId: string, currentDate: string) {
	const { user } = useAuth();
	const [latestWorkout, setLatestWorkout] = useState<Workout>(buildEmptyWorkout());

	// Fetch the latest workout
	useEffect(() => {
		if (!user || !exerciseId) {
			setLatestWorkout(buildEmptyWorkout());
			return;
		}

		const unsubscribe = getWorkout(user.uid, exerciseId, currentDate, setLatestWorkout);

		return () => {
			unsubscribe();
		};
	}, [user, exerciseId, currentDate]);

	const handleUpdateWorkout = useCallback(
		async (workout: Workout) => {
			if (!user || !exerciseId) {
				console.log('User must be authenticated and exercise ID must be provided');
				toast.error('Internal error', { toastId: 'exercise-error' });
				return;
			}

			if (!workout.id) {
				console.log('workout id must be provided');
				toast.error('Internal error', { toastId: 'exercise-error' });
				return;
			}

			try {
				return updateWorkout(user.uid, exerciseId, workout);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'Failed to update workout', {
					toastId: 'exercise-error',
				});
				console.error(err);
			}
		},
		[user, exerciseId],
	);

	const handleDeleteWorkout = useCallback(
		(workoutId: string) => {
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
		},
		[user, exerciseId],
	);

	return {
		latestWorkout,
		setLatestWorkout,
		updateWorkout: handleUpdateWorkout,
		deleteWorkout: handleDeleteWorkout,
	};
}
