import { gFormatDate } from '@/lib/consts';

export type WorkoutSet = {
	reps: number;
	weight: number;
};

export type Workout = {
	id: string;
	date: string;
	sets: WorkoutSet[];
	createdAt: string;
};

export function buildEmptyWorkout() {
	return {
		id: '',
		date: gFormatDate(new Date()),
		sets: [],
		createdAt: new Date().toString(),
	};
}
