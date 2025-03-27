import { gFormatDate } from '@/lib/consts';

export type WorkoutSet = {
	reps: number;
	weight: number;
};

export type Workout = {
	id: string;
	sets: WorkoutSet[];
	createdAt: string;
};

export function buildEmptyWorkout(): Workout {
	return {
		id: '',
		createdAt: gFormatDate(new Date()),
		sets: [],
	};
}
