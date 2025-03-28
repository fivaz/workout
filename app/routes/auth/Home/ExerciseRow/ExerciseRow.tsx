import GText from '@/components/GText';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/routes/auth/Home/ExerciseRow/ExerciseFormButton';
import { useCRUDWorkouts } from '@/lib/workout/workout.hook';
import { EllipsisVerticalIcon } from 'lucide-react';
import { ExerciseRowWorkout } from '@/routes/auth/Home/ExerciseRow/ExerciseRowWorkout';

interface ExerciseRowProps {
	exercise: Exercise;
	currentDate: string;
}

export function ExerciseRow({ exercise, currentDate }: ExerciseRowProps) {
	const { latestWorkout } = useCRUDWorkouts(exercise.id, currentDate);

	return (
		<li className="flex gap-2 w-full hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-gray-900">
			<div className="size-14 bg-green-500 rounded"></div>

			<div className="flex flex-col gap-3 flex-1">
				<div className="flex gap-2">
					<GText className="flex-1">{exercise.name}</GText>
					<ExerciseFormButton exercise={exercise} workout={latestWorkout} color="white" size="p-1">
						<EllipsisVerticalIcon className="size-4" />
					</ExerciseFormButton>
				</div>
				<ExerciseRowWorkout exercise={exercise} />
			</div>
		</li>
	);
}
