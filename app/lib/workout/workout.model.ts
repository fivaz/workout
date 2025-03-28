export type Workout = {
	id: string;
	sets: WorkoutSet[];
	date: string;
};

export type WorkoutSet = {
	reps: number | '';
	weight: number | '';
	time: string;
};

export function buildEmptyWorkout(): Workout {
	return {
		id: '',
		date: '',
		sets: [
			{
				time: '',
				reps: 10,
				weight: 10,
			},
			{
				time: '',
				reps: 10,
				weight: 15,
			},
			{
				time: '',
				reps: 10,
				weight: 20,
			},
		],
	};
}
