import { usePrograms } from '@/lib/program/programContext';
import GText from '@/components/GText';
import { PlusIcon } from 'lucide-react';
import { ProgramRow } from '@/routes/auth/Programs/ProgramRow/ProgramRow';
import { ProgramFormButton } from '@/routes/auth/Programs/ProgramFormButton';
import { buildEmptyProgram } from '@/lib/program/program.model';
import NoPrograms from '@/routes/auth/Programs/NoPrograms';

export default function Programs() {
	const { programs } = usePrograms();

	const newProgram = buildEmptyProgram();

	return (
		<div className="w-full flex flex-col gap-3 rounded-md">
			<div className="flex gap-2 justify-between items-center">
				<GText tag="h1" className="text-lg">
					Programs
				</GText>
				<ProgramFormButton program={newProgram}>
					<PlusIcon className="size-5" />
					Program
				</ProgramFormButton>
			</div>

			{programs.length ? (
				<ul className="flex-1 flex flex-col gap-3">
					{programs.map((program) => (
						<ProgramRow key={program.id} program={program} />
					))}
				</ul>
			) : (
				<NoPrograms />
			)}
		</div>
	);
}
