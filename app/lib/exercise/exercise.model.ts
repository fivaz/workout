export type Exercise = {
	id: string;
	name: string;
	image: string;
	createdAt: string;
	muscles: string[];
	programsIds: string[];
};

export function buildEmptyExercise(): Exercise {
	return {
		id: '',
		image: '',
		name: '',
		createdAt: '',
		muscles: [],
		programsIds: [],
	};
}
