import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import type { Program } from '@/lib/program/program.model';
import {
	createProgram,
	deleteProgram,
	getPrograms,
	updateProgram,
} from '@/lib/program/program.repository';
import type { ProgramContextType } from '@/lib/program/programContext';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router';

export function useProgramId() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const key = 'selectedProgramId';

	useEffect(() => {
		const myParam = searchParams.get(key);
		const stored = localStorage.getItem(key);

		if (!myParam && stored) {
			// If URL is missing the param, navigate with it
			navigate(`?${key}=${stored}`, { replace: true });
		} else if (myParam) {
			// Update localStorage if URL param is present
			localStorage.setItem(key, myParam);
		}
	}, [searchParams, navigate]);

	return searchParams.get(key) ?? localStorage.getItem(key);
}

export function useCRUDPrograms(): ProgramContextType {
	const { user } = useAuth();
	const [programs, setPrograms] = useState<Program[]>([]);

	// Subscribe to real-time program updates
	useEffect(() => {
		if (!user) {
			setPrograms([]);
			return;
		}

		return getPrograms(
			user.uid,
			(programsData) => setPrograms(programsData),
			(error) => toast.error(error, { toastId: 'program-error' }),
		);
	}, [user]);

	// Create new program
	async function handleCreateProgram(program: Omit<Program, 'id'>): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await createProgram(user.uid, program);
			toast.success(`"${program.name}" created successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create program';
			toast.error(message);
			console.error(err);
		}
	}

	// Update existing program
	async function handleUpdateProgram(program: Program): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await updateProgram(user.uid, program);
			toast.success(`"${program.name}" updated successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update program';
			toast.error(message);
			console.error(err);
		}
	}

	// Delete program
	function handleDeleteProgram(program: Program): void {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			void deleteProgram(user.uid, program);
			toast.success(`"${program.name}" deleted successfully`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete program';
			toast.error(message);
			console.error(err);
		}
	}

	return {
		programs,
		createProgram: handleCreateProgram,
		updateProgram: handleUpdateProgram,
		deleteProgram: handleDeleteProgram,
	};
}
