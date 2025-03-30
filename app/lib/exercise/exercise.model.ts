import type { Program } from '../program/program.model';

export type Exercise = {
	id: string;
	name: string;
	image: string;
	createdAt: string;
	muscles: string[];
	programsIds: string[];
};

export function buildEmptyExercise(program?: Program): Exercise {
	return {
		id: '',
		image: '',
		name: '',
		createdAt: '',
		muscles: program?.muscles || [],
		programsIds: program ? [program.id] : [],
	};
}
