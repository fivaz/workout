import { usePrograms } from '@/lib/program/programContext';
import GText from '@/components/GText';
import { DumbbellIcon, PlusIcon } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { ProgramExerciseRow } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ProgramExerciseRow';
import { ROUTES } from '@/lib/consts';
import GButton from '@/components/GButton';

export default function ProgramPage() {
	const { programId } = useParams();

	const { programs } = usePrograms();
	const { exercises } = useExercises();

	const program = programs.find((program) => program.id === programId);

	const programExercises = program
		? exercises.filter((exercises) => exercises.programsIds.includes(program.id))
		: [];

	const muscleExercises = program
		? exercises.filter((exercise) => {
				// Check if exercise is not in programExercises
				const notInProgram = !programExercises.some((pe) => pe.id === exercise.id);

				// Check if any exercise.muscles exists in program.muscles
				const hasMatchingMuscle = exercise.muscles.some((muscle) =>
					program.muscles.includes(muscle),
				);

				return notInProgram && hasMatchingMuscle;
			})
		: [];

	const newExercise = buildEmptyExercise(program);

	return (
		<>
			{program ? (
				<div className="w-full p-3 flex flex-col gap-3 rounded-md relative flex-1">
					<div className="flex gap-2 justify-between items-center">
						<GText tag="h1" className="text-lg capitalize">
							{program.name}
						</GText>
						<ExerciseFormButton exercise={newExercise}>
							<PlusIcon className="size-5" />
						</ExerciseFormButton>
					</div>

					<GText>Existing exercises</GText>
					<ul className="flex flex-col gap-3">
						{programExercises.map((exercise) => (
							<ProgramExerciseRow key={exercise.id} exercise={exercise} />
						))}
					</ul>
					<GText>Others</GText>
					<ul className="flex flex-col gap-3 pb-10">
						{muscleExercises.map((exercise) => (
							<ProgramExerciseRow key={exercise.id} exercise={exercise} />
						))}
					</ul>
					<NavLink
						to={`${ROUTES.HOME}?selectedProgramId=${program.id}`}
						className="absolute left-1/2 bottom-0 z-10 mb-3 -translate-x-1/2"
					>
						<GButton>
							<DumbbellIcon />
							Use Program
						</GButton>
					</NavLink>
				</div>
			) : (
				<div>No Program exist</div>
			)}
		</>
	);
}
