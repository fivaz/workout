import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { TrainExerciseRow } from '@/routes/auth/Train/TrainExerciseRow/TrainExerciseRow';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { PlusIcon } from 'lucide-react';
import { usePrograms } from '@/lib/program/programContext';
import { useSearchParams } from 'react-router';
import NoProgramSelected from '@/routes/auth/Train/NoProgramSelected';
import NoProgramExercises from '@/routes/auth/Programs/NoProgramExercises';

export default function Train() {
	const [searchParams] = useSearchParams();
	const { exercises } = useExercises();
	const { programs } = usePrograms();

	const selectedProgram = programs.find(
		(program) => program.id === searchParams.get('selectedProgramId'),
	);

	const newExercise = buildEmptyExercise(selectedProgram);

	const programExercises =
		(selectedProgram &&
			exercises.filter((exercise) => exercise.programsIds.includes(selectedProgram.id))) ||
		exercises;

	return (
		<>
			{selectedProgram ? (
				<div className="flex flex-col gap-3 rounded-md">
					<div className="flex gap-2 justify-between items-center">
						<GText tag="h1" className="text-lg">
							{selectedProgram.name}
						</GText>
						<ExerciseFormButton exercise={newExercise}>
							<PlusIcon className="size-5" />
							Exercise
						</ExerciseFormButton>
					</div>

					{programExercises.length ? (
						<ul className="flex-1 flex flex-col gap-3">
							{programExercises.map((exercise) => (
								<TrainExerciseRow key={exercise.id} exercise={exercise} />
							))}
						</ul>
					) : (
						<NoProgramExercises />
					)}
				</div>
			) : (
				<div className="flex flex-col gap-3">
					<GText tag="h1" className="text-lg">
						Train
					</GText>
					<NoProgramSelected />
				</div>
			)}
		</>
	);
}
