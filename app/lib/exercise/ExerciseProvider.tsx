import type { PropsWithChildren } from 'react';
import { ExerciseContext } from '@/lib/exercise/exerciseContext';
import { useCRUDExercises } from '@/lib/exercise/exercise.hook';

export function ExerciseProvider({ children }: PropsWithChildren) {
	const value = useCRUDExercises();

	return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
}
