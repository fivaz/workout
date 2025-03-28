export type Workout = {
	id: string;
	sets: WorkoutSet[];
	createdAt: string;
};

export type WorkoutSet = {
	reps: number | '';
	weight: number | '';
	time: string;
};

export function buildEmptyWorkout(): Workout {
	return {
		id: '',
		createdAt: '',
		sets: [
			{
				time: '',
				reps: '',
				weight: '',
			},
			{
				time: '',
				reps: '',
				weight: '',
			},
			{
				time: '',
				reps: '',
				weight: '',
			},
		],
	};
}
