import { usePrograms } from '@/lib/program/programContext';
import GText from '@/components/GText';
import { DumbbellIcon, PlusIcon } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import { buildEmptyExercise, type Exercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ProgramExerciseRow } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/ProgramExerciseRow';
import { ROUTES } from '@/lib/consts';
import GButton from '@/components/GButton';
import DropProgramHere from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/DropProgramHere';
import NoExercises from '@/routes/auth/Programs/ProgramRow/ProgramPage/NoExercises';
import ProgramNotFound from '@/routes/auth/Programs/ProgramRow/ProgramPage/ProgramNotFound';
import {
	getMuscleExercises,
	getOtherExercises,
	getProgramExercises,
} from '@/routes/auth/Programs/ProgramRow/ProgramPage/service';
import { ExercisesList } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/ExercisesList';
import { useEffect } from 'react';

export default function ProgramPage() {
	const { programId } = useParams();

	const { programs } = usePrograms();
	const { exercises } = useExercises();

	useEffect(() => {
		console.log(exercises);
	}, [exercises]);

	const program = programs.find((program) => program.id === programId);

	const programExercises = getProgramExercises(exercises, programId);

	const muscleExercises = getMuscleExercises(exercises, program?.muscles);

	const otherExercises = getOtherExercises(programExercises, muscleExercises);

	const newExercise = buildEmptyExercise(program);

	if (!programId || !program) return <ProgramNotFound />;

	return (
		<div className="relative flex w-full flex-1 flex-col gap-3 rounded-md">
			<div className="flex items-center justify-between gap-2">
				<GText tag="h1" className="text-lg capitalize">
					{program.name}
				</GText>
				<ExerciseFormButton exercise={newExercise} />
			</div>

			{programExercises.length || muscleExercises.length ? (
				<ExercisesList
					programExercises={programExercises}
					otherExercises={otherExercises}
					programId={programId}
				/>
			) : (
				<NoExercises />
			)}

			<NavLink
				to={ROUTES.TRAIN(programId)}
				className="fixed bottom-15 left-1/2 z-10 mb-3 -translate-x-1/2"
			>
				<GButton>
					<DumbbellIcon />
					Use Program
				</GButton>
			</NavLink>
		</div>
	);
}
