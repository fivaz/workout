type ExerciseHistory = {
	weight: number;
	repetition: number;
};

export type Exercise = {
	id: string;
	name: string;
	// image: string;
	// history: Record<string, ExerciseHistory>;
};

export function buildExercise(formData: FormData): Omit<Exercise, 'id'> & { id?: string } {
	return {
		name: formData.get('name') as string,
	};
}
