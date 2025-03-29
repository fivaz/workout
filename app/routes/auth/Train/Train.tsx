import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { TrainExerciseRow } from '@/routes/auth/Train/TrainExerciseRow/TrainExerciseRow';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { PlusIcon } from 'lucide-react';

export default function Train() {
	const { exercises } = useExercises();

	const newExercise = buildEmptyExercise();

	return (
		<div className="w-full p-3 flex flex-col gap-3 rounded-md">
			<div className="flex gap-2 justify-between items-center">
				<GText tag="h1" className="text-lg">
					Exercises
				</GText>
				<ExerciseFormButton exercise={newExercise}>
					<PlusIcon className="size-5" />
					Exercise
				</ExerciseFormButton>
			</div>

			<ul className="flex-1 flex flex-col gap-3">
				{exercises.map((exercise) => (
					<TrainExerciseRow key={exercise.id} exercise={exercise} />
				))}
			</ul>
		</div>
	);
}
