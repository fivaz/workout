import GText from '@/components/GText';
import { ProgramFormButton } from '@/routes/auth/Programs/ProgramFormButton';
import { EllipsisVerticalIcon } from 'lucide-react';
import type { Program } from '@/lib/program/program.model';
import { NavLink } from 'react-router';
import { ROUTES } from '@/lib/consts';

export function ProgramRow({ program }: { program: Program }) {
	return (
		<li className="hover-group flex w-full gap-2 rounded-md border border-gray-200 bg-gray-100 p-2 hover:bg-gray-300 dark:border-gray-500 dark:bg-gray-900 dark:hover:bg-gray-900">
			<NavLink to={`${ROUTES.PROGRAMS}/${program.id}`} className="flex flex-1 gap-2">
				<div className="size-14 shrink-0 rounded bg-green-500"></div>

				<GText className="flex-1">{program.name}</GText>
			</NavLink>
			<ProgramFormButton program={program} color="white" size="p-1" className="self-start">
				<EllipsisVerticalIcon className="size-4" />
			</ProgramFormButton>
		</li>
	);
}
