// Custom hook to use the exercise context
import { createContext, useContext } from 'react';
import type { Exercise } from '@/lib/exercise/exercise.model';

// Define the context type
export interface ExerciseContextType {
	exercises: Exercise[];
	createExercise: (exercise: Exercise, file: File | null) => void;
	updateExercise: (exercise: Exercise, file: File | null) => void;
	deleteExercise: (exercise: Exercise) => void;
	updateExercisesOrder: (exercises: Exercise[]) => void;
	addExercisesToProgram: (exercises: Exercise[], programId: string) => void;
	removeExercisesFromProgram: (exercises: Exercise[], programId: string) => void;
}

// Create the context
export const ExerciseContext = createContext<ExerciseContextType>({
	exercises: [],
	createExercise: (exercise: Exercise, file: File | null) => {},
	updateExercise: (exercise: Exercise, file: File | null) => {},
	deleteExercise: (exercise: Exercise) => {},
	updateExercisesOrder: (exercises: Exercise[]) => {},
	addExercisesToProgram: (exercises: Exercise[], programId: string) => {},
	removeExercisesFromProgram: (exercises: Exercise[], programId: string) => {},
});

export function useExercises() {
	const context = useContext(ExerciseContext);
	if (context === undefined) {
		throw new Error('useExercises must be used within an ExerciseProvider');
	}
	return context;
}
