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

export function buildEmptyWorkout(latestWorkout?: Workout, override?: Partial<Workout>): Workout {
	const newId = override?.id ?? '';
	const newDate = override?.createdAt ?? '';

	if (latestWorkout) {
		return {
			id: newId,
			createdAt: newDate,
			sets: latestWorkout.sets.map((set) => ({
				reps: set.reps,
				weight: set.weight,
				time: '',
			})),
		};
	}

	return {
		id: newId,
		createdAt: newDate,
		sets: [
			{ time: '', reps: '', weight: '' },
			{ time: '', reps: '', weight: '' },
			{ time: '', reps: '', weight: '' },
		],
	};
}
