import GText from '@/components/GText';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { EllipsisVerticalIcon, LoaderCircleIcon } from 'lucide-react';
import { ExerciseRowWorkout } from '@/routes/auth/Train/TrainExerciseRow/ExerciseRowWorkout';
import GImage from '@/components/GImage';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';

interface ExerciseRowProps {
	exercise: Exercise;
	index: number;
}

export function TrainExerciseRow({ exercise, index }: ExerciseRowProps) {
	const { ref } = useSortable({ id: exercise.id, index });
	const [loading, setLoading] = useState(false);

	return (
		<li
			ref={ref}
			className="hover-group flex w-full gap-2 rounded-md border border-gray-200 bg-gray-100 p-2 hover:bg-gray-300 dark:border-gray-500 dark:bg-gray-900 dark:hover:bg-gray-900"
		>
			<div className="flex flex-1 flex-col gap-2">
				<div className="-mb-6 flex items-start gap-2">
					<GImage size="size-12" alt="exercise" src={exercise.image} />
					<GText className="flex-1 text-sm">{exercise.name}</GText>
					{loading && <LoaderCircleIcon className="size-5 animate-spin text-blue-500" />}
					<ExerciseFormButton exercise={exercise} color="white" size="p-1">
						<EllipsisVerticalIcon className="size-4" />
					</ExerciseFormButton>
				</div>
				<ExerciseRowWorkout exercise={exercise} setLoading={setLoading} />
			</div>
		</li>
	);
}
