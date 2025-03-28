import type { Muscle } from '@/lib/utils';
import type { Exercise } from '@/lib/exercise/exercise.model';

export type Program = {
	id: string;
	name: string;
	muscles: Muscle[];
	createdAt: string;
};

export function buildEmptyProgram(): Program {
	return {
		id: '',
		name: '',
		createdAt: '',
		muscles: [],
	};
}
