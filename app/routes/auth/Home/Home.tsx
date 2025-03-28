import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ExerciseRow } from '@/routes/auth/Home/ExerciseRow/ExerciseRow';
import { ExerciseFormButton } from '@/routes/auth/Home/ExerciseRow/ExerciseFormButton';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { PlusIcon } from 'lucide-react';

export default function Home() {
	const { exercises } = useExercises();

	const newExercise = buildEmptyExercise();

	return (
		<div className="min-h-screen p-3 flex flex-col gap-3 rounded-md">
			<div className="flex gap-2 justify-between items-center">
				<GText tag="h1" className="text-lg">
					Exercises
				</GText>
				<ExerciseFormButton exercise={newExercise}>
					<PlusIcon className="size-5" />
					Exercise
				</ExerciseFormButton>
			</div>

			<ul className="flex flex-col gap-3">
				{exercises.map((exercise) => (
					<ExerciseRow key={exercise.id} exercise={exercise} />
				))}
			</ul>
		</div>
	);
}
