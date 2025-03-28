export type Exercise = {
	id: string;
	name: string;
	image: string;
	createdAt?: string;
};

export function buildEmptyExercise(): Exercise {
	return {
		id: '',
		image: '',
		name: '',
		createdAt: '',
	};
}
