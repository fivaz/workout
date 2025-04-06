import GText from '@/components/GText';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { EllipsisVerticalIcon, LoaderCircleIcon } from 'lucide-react';
import { ExerciseRowWorkout } from '@/routes/auth/Train/TrainExerciseRow/ExerciseRowWorkout';
import GImage from '@/components/GImage';
import { useState } from 'react';

interface ExerciseRowProps {
	exercise: Exercise;
}

export function TrainExerciseRow({ exercise }: ExerciseRowProps) {
	const [loading, setLoading] = useState(false);

	return (
		<li className="w-full flex gap-2 hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-gray-900">
			<GImage alt="exercise" src={exercise.image} />

			<div className="flex flex-col gap-3 flex-1">
				<div className="flex gap-2 items-center">
					<GText className="flex-1 text-sm">{exercise.name}</GText>
					{loading && <LoaderCircleIcon className="animate-spin size-5 text-blue-500" />}
					<ExerciseFormButton exercise={exercise} color="white" size="p-1">
						<EllipsisVerticalIcon className="size-4" />
					</ExerciseFormButton>
				</div>
				<ExerciseRowWorkout exercise={exercise} setLoading={setLoading} />
			</div>
		</li>
	);
}
