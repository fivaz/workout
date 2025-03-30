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

export function buildEmptyWorkout(latestWorkout?: Workout): Workout {
	if (latestWorkout) {
		return {
			id: '',
			createdAt: '',
			sets: latestWorkout.sets.map((set) => ({
				reps: set.reps,
				weight: set.weight,
				time: '',
			})),
		};
	}

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
