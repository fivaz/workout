import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import type { Set } from '@/lib/set/set.model';
import { createSet, deleteSet, getSets, updateSet } from '@/lib/set/set.reposiroty'; // Assuming this is where your set repository functions live

export function useCRUDSets(exerciseId: string) {
	const { user } = useAuth();
	const [sets, setSets] = useState<Set[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Fetch sets with real-time updates
	useEffect(() => {
		if (!user || !exerciseId) {
			setSets([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const unsubscribe = getSets(
			user.uid,
			exerciseId,
			(setsData) => {
				setSets(setsData);
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
	}, [user, exerciseId]);

	// CRUD operations with shared state
	async function handleCreateSet(set: Set) {
		if (!user || !exerciseId) {
			setError('User must be authenticated and exercise ID must be provided');
			return;
		}

		setLoading(true);
		try {
			const newSetId = await createSet(user.uid, exerciseId, set);
			setSuccess('Set created successfully');
			return newSetId;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create set');
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdateSet(set: Set) {
		if (!user || !exerciseId) {
			setError('User must be authenticated and exercise ID must be provided');
			return;
		}

		setLoading(true);
		try {
			await updateSet(user.uid, exerciseId, set);
			setSuccess('Set updated successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update set');
		} finally {
			setLoading(false);
		}
	}

	async function handleDeleteSet(setId: string) {
		if (!user || !exerciseId) {
			setError('User must be authenticated and exercise ID must be provided');
			return;
		}

		setLoading(true);
		try {
			await deleteSet(user.uid, exerciseId, setId);
			setSuccess('Set deleted successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete set');
		} finally {
			setLoading(false);
		}
	}

	return {
		sets,
		loading,
		error,
		success,
		createSet: handleCreateSet,
		updateSet: handleUpdateSet,
		deleteSet: handleDeleteSet,
	};
}
