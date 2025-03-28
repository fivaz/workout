import GText from '@/components/GText';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/routes/auth/Home/ExerciseRow/ExerciseFormButton';
import { EllipsisVerticalIcon } from 'lucide-react';
import { ExerciseRowSets } from '@/routes/auth/Home/ExerciseRow/ExerciseRowSets';

interface ExerciseRowProps {
	exercise: Exercise;
}

export function ExerciseRow({ exercise }: ExerciseRowProps) {
	return (
		<li className="flex gap-2 w-full hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-gray-900">
			<div className="size-14 bg-green-500 rounded"></div>

			<div className="flex flex-col gap-3 flex-1">
				<div className="flex gap-2">
					<GText className="flex-1">{exercise.name}</GText>
					<ExerciseFormButton exercise={exercise} color="white" size="p-1">
						<EllipsisVerticalIcon className="size-4" />
					</ExerciseFormButton>
				</div>
				<ExerciseRowSets exercise={exercise} />
			</div>
		</li>
	);
}
