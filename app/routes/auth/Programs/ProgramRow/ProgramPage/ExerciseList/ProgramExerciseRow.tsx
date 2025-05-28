import GText from '@/components/GText';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { EllipsisVerticalIcon } from 'lucide-react';
import GImage from '@/components/GImage';
import { useSortable } from '@dnd-kit/react/sortable';

interface ProgramExerciseRowProps {
	exercise: Exercise;
	index: number;
	group: string;
}

export function ProgramExerciseRow({ exercise, index, group }: ProgramExerciseRowProps) {
	const { isDragging, ref } = useSortable({
		id: exercise.id,
		index,
		type: 'item',
		accept: ['item'],
		group,
	});

	return (
		<li
			ref={ref}
			data-dragging={isDragging}
			className="hover-group flex w-full gap-2 rounded-md border border-gray-200 bg-gray-100 p-2 hover:bg-gray-300 dark:border-gray-500 dark:bg-gray-900 dark:hover:bg-gray-900"
		>
			<GImage src={exercise.image} alt="exercise" />

			<div className="flex flex-1 flex-col gap-2">
				<GText className="flex-1">{exercise.name}</GText>
				<GText className="flex-1">{exercise.muscles}</GText>
			</div>

			<ExerciseFormButton exercise={exercise} color="white" size="p-1" className="self-start">
				<EllipsisVerticalIcon className="size-4" />
			</ExerciseFormButton>
		</li>
	);
}
