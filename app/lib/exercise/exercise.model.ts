import type { Muscle } from '@/lib/utils';

export type Exercise = {
	id: string;
	name: string;
	image: string;
	createdAt: string;
	muscles: Muscle[];
};

export function buildEmptyExercise(): Exercise {
	return {
		id: '',
		image: '',
		name: '',
		createdAt: '',
		muscles: [],
	};
}
