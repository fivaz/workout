import type { PropsWithChildren } from 'react';
import { ExerciseContext } from '@/lib/exercise/exerciseContext';
import { useGetExercises } from '@/lib/exercise/exercise.repository';

export function ExerciseProvider({ children }: PropsWithChildren) {
	const value = useGetExercises();

	return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
}
