import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { buildEmptyWorkout, type WorkoutSet } from '@/lib/set/set.model';
import { createSet, deleteSet, getLatestSets, updateSet } from '@/lib/set/set.repository';
import { toast } from 'react-toastify';

export function useCRUDSets(exerciseId: string, currentDate: string) {
	const { user } = useAuth();
	const [latestSets, setLatestSets] = useState<WorkoutSet[]>(buildEmptyWorkout());

	// Fetch the latest workout sets
	useEffect(() => {
		async function fetchLatestSets() {
			if (!user || !exerciseId) {
				setLatestSets(buildEmptyWorkout());
				return;
			}

			try {
				const sets = await getLatestSets(user.uid, exerciseId, currentDate);
				setLatestSets(sets.length > 0 ? sets : buildEmptyWorkout());
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'Failed to fetch latest workout sets', {
					toastId: 'exercise-error',
				});
				console.error(err);
			}
		}

		void fetchLatestSets();
	}, [user, exerciseId, currentDate]);

	// CRUD operations with shared state
	function handleCreateSet(set: WorkoutSet) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			void createSet(user.uid, exerciseId, set);
			toast.success('Workout set created successfully', {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create workout set', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	function handleUpdateSet(set: WorkoutSet) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			void updateSet(user.uid, exerciseId, set);
			toast.success('Workout set updated successfully', {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update workout set', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	function handleDeleteSet(setId: string) {
		if (!user || !exerciseId) {
			toast.error('User must be authenticated and exercise ID must be provided', {
				toastId: 'exercise-error',
			});
			return;
		}

		try {
			void deleteSet(user.uid, exerciseId, setId);
			toast.success('Workout set deleted successfully', {
				toastId: 'exercise-success',
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete workout set', {
				toastId: 'exercise-error',
			});
			console.error(err);
		}
	}

	return {
		latestSets,
		setLatestSets,
		createSet: handleCreateSet,
		updateSet: handleUpdateSet,
		deleteSet: handleDeleteSet,
	};
}
