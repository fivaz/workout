import { ProgramExerciseRow } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/ProgramExerciseRow';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useCRUDExercises } from '@/lib/exercise/exercise.hook';
import { Group } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/ExerciseGroup';

export function ExercisesList({
	programExercises,
	otherExercises,
	programId,
}: {
	programExercises: Exercise[];
	otherExercises: Exercise[];
	programId: string;
}) {
	const [exercises, setExercises] = useState({
		programExercises,
		otherExercises,
	});

	const { addExercisesToProgram, removeExercisesFromProgram } = useCRUDExercises();

	const titles: Record<string, string> = {
		programExercises: 'Existing exercises',
		otherExercises: 'Other exercises',
	};

	const handleDragOver = (event: Parameters<typeof move>[1]) => {
		const newExercises = move(exercises, event);
		setExercises(newExercises);
		console.log('handleDragOver', newExercises);
	};

	const handleDragEnd = (event: Parameters<typeof move>[1]) => {
		const newExercises = move(exercises, event);
		setExercises(newExercises);
		console.log('handleDragEnd', newExercises);
		addExercisesToProgram(exercises.programExercises, programId);
		removeExercisesFromProgram(exercises.otherExercises, programId);
	};

	return (
		<>
			<DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
				{Object.entries(exercises).map(([group, items]) => (
					<Group key={group} id={group} title={titles[group]}>
						{items.map((item, index) => (
							<ProgramExerciseRow key={item.id} index={index} exercise={item} group={group} />
						))}
					</Group>
				))}
			</DragDropProvider>
		</>
	);
}
