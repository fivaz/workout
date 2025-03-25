type ExerciseHistory = {
	weight: number;
	repetition: number;
};

export type Exercise = {
	id: string;
	name: string;
	image: string;
	history: Record<string, ExerciseHistory>;
};
