import GText from '@/components/GText';
import type { Exercise } from './exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import { XIcon } from 'lucide-react';
import { useCRUDWorkouts } from '@/lib/workout/workout.hook';

export function ExerciseRow({
	exercise,
	currentDate = new Date().toISOString().split('T')[0],
}: {
	exercise: Exercise;
	currentDate?: string;
}) {
	const { latestWorkout, updateWorkout } = useCRUDWorkouts(exercise.id, currentDate);

	return (
		<li className="hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md">
			<ExerciseFormButton
				exercise={exercise}
				workout={latestWorkout}
				color="none"
				className="flex flex-col gap-2 w-full"
			>
				<div className="flex gap-2">
					<div className="size-14 bg-green-500"></div>
					<GText>{exercise.name}</GText>
				</div>

				<div className="flex flex-col gap-3">
					<ul className="flex flex-col gap-2">
						<div className="flex gap-2">
							<div className="w-6"></div>
							<GText className="flex-1">Reps</GText>
							<GText className="flex-1">Weight</GText>
						</div>
						{latestWorkout &&
							latestWorkout.sets.length > 0 &&
							latestWorkout.sets.map((set, index) => (
								<li key={index} className="flex gap-2 items-center">
									<GText className="w-6">{index + 1}</GText>
									<GText>{set.reps}</GText>
									<GText>{set.weight}</GText>
								</li>
							))}
					</ul>
				</div>
			</ExerciseFormButton>
		</li>
	);
}
