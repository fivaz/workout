import { useExercises } from '@/lib/exercise/exerciseContext';
import GText from '@/components/GText';
import { ExerciseFormButton } from '@/routes/auth/Home/ExerciseRow/ExerciseFormButton';
import { PlusIcon } from 'lucide-react';
import { ExerciseRow } from '@/routes/auth/Home/ExerciseRow/ExerciseRow';
import { ProgramRow } from '@/routes/auth/Programs/ProgramRow';
import GButton from '@/components/GButton';
import { usePrograms } from '@/lib/program/programContext';

export default function Programs() {
	const { programs } = usePrograms();

	return (
		<div className="w-full p-3 flex flex-col gap-3 rounded-md">
			<div className="flex gap-2 justify-between items-center">
				<GText tag="h1" className="text-lg">
					Programs
				</GText>
				<GButton>
					<PlusIcon className="size-5" />
					Program
				</GButton>
			</div>

			<ul className="flex-1 flex flex-col gap-3">
				{programs.map((program) => (
					<ProgramRow key={program.id} program={program} />
				))}
			</ul>
		</div>
	);
}
