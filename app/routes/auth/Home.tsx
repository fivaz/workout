import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ExerciseRow } from '@/lib/exercise/ExerciseRow';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { PlusIcon } from 'lucide-react';
import { buildEmptyWorkout } from '@/lib/workout/workout.model';
import { gFormatDate } from '@/lib/consts';

export default function Home() {
	const { exercises } = useExercises();

	const newExercise = buildEmptyExercise();
	const newWorkout = buildEmptyWorkout();

	const currentDate = gFormatDate(new Date());

	return (
		<div className="min-h-screen p-3 flex flex-col gap-3 rounded-md">
			<div className="flex gap-2 justify-between items-center">
				<GText tag="h1" className="text-lg">
					Exercises
				</GText>
				<ExerciseFormButton exercise={newExercise} workout={newWorkout}>
					<PlusIcon className="size-5" />
					Exercise
				</ExerciseFormButton>
			</div>

			<ul className="flex flex-col gap-3">
				{exercises.map((exercise) => (
					<ExerciseRow key={exercise.id} exercise={exercise} currentDate={currentDate} />
				))}
			</ul>
		</div>
	);
}
