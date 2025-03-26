export type Exercise = {
	id: string;
	name: string;
	createdAt?: string;
};

export function buildEmptyExercise(): Exercise {
	return {
		id: '',
		name: '',
		createdAt: '',
	};
}
