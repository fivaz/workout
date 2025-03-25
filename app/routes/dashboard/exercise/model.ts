type ExerciseHistory = {
	weight: number;
	repetition: number;
};

export type Exercise = {
	name: string;
	image: string;
	history: Record<string, ExerciseHistory>;
};
