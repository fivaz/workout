import GText from '@/components/GText';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { TrainExerciseRow } from '@/routes/auth/Train/TrainExerciseRow/TrainExerciseRow';
import { type Exercise } from '@/lib/exercise/exercise.model';

import { usePrograms } from '@/lib/program/programContext';
import NoProgramSelected from '@/routes/auth/Train/NoProgramSelected';
import NoProgramExercises from '@/routes/auth/Programs/NoProgramExercises';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useEffect, useState } from 'react';
import { useCRUDExercises } from '@/lib/exercise/exercise.hook';

import TrainHeader from '@/routes/auth/Train/TrainHeader';
import { useCRUDSessions } from '@/lib/session/session.hook';

export default function TrainPage() {
	const { exercises } = useExercises();
	const { programs } = usePrograms();
	const { updateExercisesOrder } = useCRUDExercises();

	const { currentSession, loading } = useCRUDSessions();
	const currentProgramId = currentSession?.programId ?? null;

	const selectedProgram = programs.find((program) => program.id === currentProgramId);

	const [programExercises, setProgramExercises] = useState<Exercise[]>([]);

	useEffect(() => {
		setProgramExercises(
			exercises.filter((exercise) => exercise.programsIds.includes(selectedProgram?.id || '')),
		);
	}, [exercises, selectedProgram]);

	const handleDragEnd = (event: Parameters<typeof move>[1]) => {
		const newExercises = move(programExercises, event);
		setProgramExercises(newExercises);

		void updateExercisesOrder(newExercises);
	};

	if (loading) {
		return <div>Loading current program...</div>;
	}

	if (!selectedProgram) {
		return (
			<div className="flex flex-col gap-3">
				<GText tag="h1" className="text-lg">
					Train
				</GText>
				<NoProgramSelected />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 rounded-md pb-4">
			<TrainHeader selectedProgram={selectedProgram} />
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
	);
}
