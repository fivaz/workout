import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ExerciseRow } from '@/lib/exercise/ExerciseRow';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';

export default function Home() {
	const { exercises } = useExercises();

	console.log(exercises);

	const newExercise = buildEmptyExercise();

	return (
		<div className="mt-5 p-3">
			<div className="p-3 flex flex-col gap-3 rounded-md border dark:border-gray-600 border-gray-200">
				<GText tag="h1">Exercises</GText>

				<ul className="flex flex-col gap-3 p-2 rounded-md border border-gray-200 dark:border-gray-500 divide-y divide-gray-200 dark:divide-gray-500">
					{exercises.map((exercise) => (
						<ExerciseRow key={exercise.id} exercise={exercise} />
					))}
				</ul>

				<ExerciseFormButton exercise={newExercise}>Add Exercise</ExerciseFormButton>
			</div>
		</div>
	);
}
