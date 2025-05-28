import GText from '@/components/GText';
import { ProgramExerciseRow } from '@/routes/auth/Programs/ProgramRow/ProgramPage/ProgramExerciseRow';
import DropProgramHere from '@/routes/auth/Programs/ProgramRow/ProgramPage/DropProgramHere';
import type { Exercise } from '@/lib/exercise/exercise.model';

export function ExercisesList({
	programExercises,
	otherExercises,
}: {
	programExercises: Exercise[];
	otherExercises: Exercise[];
}) {
	return (
		<>
			<GText tag="h2" className="text-sm">
				Existing exercises
			</GText>
			<ul className="flex flex-col gap-3">
				{programExercises.map((exercise) => (
					<ProgramExerciseRow key={exercise.id} exercise={exercise} />
				))}
				<li>
					<DropProgramHere />
				</li>
			</ul>
			<GText tag="h2" className="text-sm">
				Others
			</GText>
			<ul className="flex flex-col gap-3 pb-10">
				{otherExercises.map((exercise) => (
					<ProgramExerciseRow key={exercise.id} exercise={exercise} />
				))}
				<li>
					<DropProgramHere />
				</li>
			</ul>
		</>
	);
}
