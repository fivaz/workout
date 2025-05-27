import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { TrainExerciseRow } from '@/routes/auth/Train/TrainExerciseRow/TrainExerciseRow';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { buildEmptyExercise, type Exercise } from '@/lib/exercise/exercise.model';
import { PlusIcon } from 'lucide-react';
import { usePrograms } from '@/lib/program/programContext';
import { useSearchParams } from 'react-router';
import NoProgramSelected from '@/routes/auth/Train/NoProgramSelected';
import NoProgramExercises from '@/routes/auth/Programs/NoProgramExercises';
import { useProgramId } from '@/lib/program/program.hook';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useEffect, useState } from 'react';
import { useCRUDExercises } from '@/lib/exercise/exercise.hook';

export default function Train() {
	const { exercises } = useExercises();
	const { programs } = usePrograms();
	const programId = useProgramId();
	const { updateExercisesOrder } = useCRUDExercises();

	const selectedProgram = programs.find((program) => program.id === programId);

	const [programExercises, setProgramExercises] = useState<Exercise[]>([]);

	useEffect(() => {
		setProgramExercises(
			exercises.filter((exercise) => exercise.programsIds.includes(selectedProgram?.id || '')),
		);
	}, [exercises, selectedProgram]);

	const newExercise = buildEmptyExercise(selectedProgram);

	const handleDragEnd = (event: Parameters<typeof move>[1]) => {
		const newExercises = move(programExercises, event);
		setProgramExercises(newExercises);

		void updateExercisesOrder(newExercises);
	};

	return (
		<>
			{selectedProgram ? (
				<div className="flex flex-col gap-3 rounded-md pb-4">
					<div className="flex items-center justify-between gap-2">
						<GText tag="h1" className="text-lg">
							{selectedProgram.name}
						</GText>
						<ExerciseFormButton exercise={newExercise}>
							<PlusIcon className="size-5" />
							Exercise
						</ExerciseFormButton>
					</div>

					{programExercises.length ? (
						<DragDropProvider onDragEnd={handleDragEnd}>
							<ul className="flex flex-1 flex-col gap-3">
								{programExercises.map((exercise, index) => (
									<TrainExerciseRow index={index} key={exercise.id} exercise={exercise} />
								))}
							</ul>
						</DragDropProvider>
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
