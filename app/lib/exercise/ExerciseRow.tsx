import GText from '@/components/GText';
import type { Exercise } from './exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton';
import { useCRUDSets } from '@/lib/set/set.hook';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import { XIcon } from 'lucide-react';

export function ExerciseRow({ exercise }: { exercise: Exercise }) {
	const { sets } = useCRUDSets(exercise.id);

	return (
		<li className="hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md">
			<ExerciseFormButton
				exercise={exercise}
				sets={sets}
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
						{sets.length > 0 &&
							sets.map((set, index) => (
								<li key={set.id} className="flex gap-2 items-center">
									<GText className="w-6">{index + 1}</GText>
									<GInput name="reps" type="number" defaultValue={set.reps} />
									<GInput name="weight" type="number" defaultValue={set.weight} />
									<form
										method="post"
										action={`/server/exercise/${exercise.id}/sets/${set.id}/delete`}
									>
										<GButton type="submit" color="white" size="p-1.5">
											<XIcon className="size-5 text-red-500" />
										</GButton>
									</form>
								</li>
							))}
					</ul>
				</div>
			</ExerciseFormButton>
		</li>
	);
}
