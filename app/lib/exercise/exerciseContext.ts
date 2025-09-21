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
	createExercise: (_exercise: Exercise, _file: File | null) => {},
	updateExercise: (_exercise: Exercise, _file: File | null) => {},
	deleteExercise: (_exercise: Exercise) => {},
	updateExercisesOrder: (_exercises: Exercise[]) => {},
	addExercisesToProgram: (_exercises: Exercise[], _programId: string) => {},
	removeExercisesFromProgram: (_exercises: Exercise[], _programId: string) => {},
});

export function useExercises() {
	const context = useContext(ExerciseContext);
	if (context === undefined) {
		throw new Error('useExercises must be used within an ExerciseProvider');
	}
	return context;
}
