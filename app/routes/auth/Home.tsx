import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ExerciseRow } from '@/lib/exercise/ExerciseRow';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { PlusIcon } from 'lucide-react';
import { buildEmptyWorkout } from '@/lib/workout/workout.model';

export default function Home() {
	const { exercises } = useExercises();

	const newExercise = buildEmptyExercise();
	const newWorkout = buildEmptyWorkout();

	return (
		<div className="mt-5 p-3">
			<div className="p-3 flex flex-col gap-3 rounded-md border dark:border-gray-600 border-gray-200">
				<div className="flex gap-2 justify-between items-center">
					<GText tag="h1" className="text-lg">
						Exercises
					</GText>
					<ExerciseFormButton exercise={newExercise} workout={newWorkout}>
						<PlusIcon className="size-5" />
						Exercise
					</ExerciseFormButton>
				</div>

				<ul className="flex flex-col gap-3 p-2 rounded-md border border-gray-200 dark:border-gray-500 divide-y divide-gray-200 dark:divide-gray-500">
					{exercises.map((exercise) => (
						<ExerciseRow key={exercise.id} exercise={exercise} />
					))}
				</ul>
			</div>
		</div>
	);
}
