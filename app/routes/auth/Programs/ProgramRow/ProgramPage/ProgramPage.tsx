import { usePrograms } from '@/lib/program/programContext';
import GText from '@/components/GText';
import { DumbbellIcon, LandPlotIcon, PlusIcon } from 'lucide-react';
import { ProgramRow } from '@/routes/auth/Programs/ProgramRow/ProgramRow';
import { ProgramFormButton } from '@/routes/auth/Programs/ProgramFormButton';
import { buildEmptyProgram, type Program } from '@/lib/program/program.model';
import { NavLink, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { TrainExerciseRow } from '@/routes/auth/Train/TrainExerciseRow/TrainExerciseRow';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ProgramExerciseRow } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ProgramExerciseRow';
import { ROUTES } from '@/lib/consts';
import GButton from '@/components/GButton';

export default function ProgramPage() {
	const { programId } = useParams();

	const { programs } = usePrograms();
	const { exercises } = useExercises();

	const program = programs.find((program) => program.id === programId);

	const programExercises = exercises.find((exercises) => exercises.id === programId);

	const newExercise = buildEmptyExercise(program);

	return (
		<>
			{program ? (
				<div className="w-full p-3 flex flex-col gap-3 rounded-md">
					<div className="flex gap-2 justify-between items-center">
						<GText tag="h1" className="text-lg capitalize">
							{program.name}
						</GText>
						<NavLink to={`${ROUTES.HOME}?selectedProgramId=${program.id}`}>
							<GButton>
								<DumbbellIcon />
								Use Program
							</GButton>
						</NavLink>
						<ExerciseFormButton exercise={newExercise}>
							<PlusIcon className="size-5" />
						</ExerciseFormButton>
					</div>

					<ul className="flex-1 flex flex-col gap-3">
						{exercises.map((exercise) => (
							<ProgramExerciseRow key={exercise.id} exercise={exercise} />
						))}
					</ul>
				</div>
			) : (
				<div>No Program exist</div>
			)}
		</>
	);
}
