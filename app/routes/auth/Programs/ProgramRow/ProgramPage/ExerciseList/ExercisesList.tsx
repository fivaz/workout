import GText from '@/components/GText';
import { ProgramExerciseRow } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/ProgramExerciseRow';
import DropProgramHere from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/DropProgramHere';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useState, type ReactNode } from 'react';
import { DragDropProvider, useDroppable } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';

export function ExercisesList({
	programExercises,
	otherExercises,
}: {
	programExercises: Exercise[];
	otherExercises: Exercise[];
}) {
	const [exercises, setExercises] = useState({
		programExercises,
		otherExercises,
	});

	const titles: Record<string, string> = {
		programExercises: 'Existing exercises',
		otherExercises: 'Other exercises',
	};

	const handleDragEnd = (event: Parameters<typeof move>[1]) => {
		setExercises((items) => move(items, event));
	};

	return (
		<>
			<DragDropProvider onDragOver={handleDragEnd}>
				{Object.entries(exercises).map(([group, items]) => (
					<Group key={group} group={group} title={titles[group]}>
						{items.map((item, index) => (
							<ProgramExerciseRow key={item.id} index={index} exercise={item} group={group} />
						))}
					</Group>
				))}
			</DragDropProvider>
		</>
	);
}

function Group({ title, group, children }: { title: string; group: string; children: ReactNode }) {
	const { isDropTarget, ref } = useDroppable({
		id: group,
		type: 'column',
		accept: 'item',
		collisionPriority: CollisionPriority.Low,
	});

	const style = isDropTarget ? { background: '#00000030' } : undefined;

	return (
		<>
			<GText tag="h2" className="text-sm">
				{title}
			</GText>
			<ul style={style} className="flex flex-col gap-3" ref={ref}>
				{children}
				<li>
					<DropProgramHere />
				</li>
			</ul>
		</>
	);
}
