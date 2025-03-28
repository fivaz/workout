// Custom hook to use the exercise context
import { createContext, useContext } from 'react';
import type { Exercise } from '@/lib/exercise/exercise.model';

// Define the context type
export interface ExerciseContextType {
	exercises: Exercise[];
	createExercise: (exercise: Exercise) => void;
	updateExercise: (exercise: Exercise) => void;
	deleteExercise: (exerciseId: string) => void;
}

// Create the context
export const ExerciseContext = createContext<ExerciseContextType>({
	exercises: [],
	createExercise: (exercise: Exercise) => {},
	updateExercise: (exercise: Exercise) => {},
	deleteExercise: (exerciseId: string) => {},
});

export function useExercises() {
	const context = useContext(ExerciseContext);
	if (context === undefined) {
		throw new Error('useExercises must be used within an ExerciseProvider');
	}
	return context;
}
