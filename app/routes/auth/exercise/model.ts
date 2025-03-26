import { adminDb } from '@/lib/firebase.server';

type ExerciseHistory = {
	weight: number;
	repetition: number;
};

export type Exercise = {
	id: string;
	name: string;
	updatedAt: string;
	// image: string;
	// history: Record<string, ExerciseHistory>;
};
