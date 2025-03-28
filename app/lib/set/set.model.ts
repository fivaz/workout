export type WorkoutSet = {
	id: string;
	reps: number | '';
	weight: number | '';
	date: string;
};

export function buildEmptyWorkout(): WorkoutSet[] {
	return [
		{
			id: '',
			date: '',
			reps: 10,
			weight: 10,
		},
		{
			id: '',
			date: '',
			reps: 10,
			weight: 15,
		},
		{
			id: '',
			date: '',
			reps: 10,
			weight: 20,
		},
	];
}
