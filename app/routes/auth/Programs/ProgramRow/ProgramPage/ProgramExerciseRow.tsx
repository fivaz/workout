import GText from '@/components/GText';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { EllipsisVerticalIcon } from 'lucide-react';
import GImage from '@/components/GImage';

interface ProgramExerciseRowProps {
	exercise: Exercise;
}

export function ProgramExerciseRow({ exercise }: ProgramExerciseRowProps) {
	return (
		<li className="w-full flex gap-2 hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-gray-900">
			<GImage src={exercise.image} alt="exercise" />

			<div className="flex flex-col gap-2 flex-1">
				<GText className="flex-1">{exercise.name}</GText>
				<GText className="flex-1">{exercise.muscles}</GText>
			</div>

			<ExerciseFormButton exercise={exercise} color="white" size="p-1" className="self-start">
				<EllipsisVerticalIcon className="size-4" />
			</ExerciseFormButton>
		</li>
	);
}
