import type { Exercise } from '@/lib/exercise/exercise.model';

export const getProgramExercises = (exercises: Exercise[], programId?: string) => {
	return programId
		? exercises.filter((exercises) => exercises.programsIds.includes(programId))
		: [];
};

export const getMuscleExercises = (exercises: Exercise[], muscles: string[] = []) => {
	return exercises.filter((exercise) =>
		exercise.muscles.some((muscle) => muscles.includes(muscle)),
	);
};

export const getOtherExercises = (programExercises: Exercise[], muscleExercises: Exercise[]) => {
	return muscleExercises.filter(
		(muscleExercise) =>
			!programExercises.some((programExercise) => programExercise.id === muscleExercise.id),
	);
};
