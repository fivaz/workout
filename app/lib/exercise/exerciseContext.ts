// Custom hook to use the exercise context
import { createContext, useContext } from 'react';
import type { Exercise } from '@/lib/exercise/exercise.model';

// Define the context type
interface ExerciseContextType {
	exercises: Exercise[];
	loading: boolean;
	error: string | null;
}

// Create the context
export const ExerciseContext = createContext<ExerciseContextType>({
	exercises: [],
	loading: false,
	error: null,
});

export function useExercises() {
	const context = useContext(ExerciseContext);
	if (context === undefined) {
		throw new Error('useExercises must be used within an ExerciseProvider');
	}
	return context;
}
