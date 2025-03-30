import GText from '@/components/GText';
import { ProgramFormButton } from '@/routes/auth/Programs/ProgramFormButton';
import { EllipsisVerticalIcon } from 'lucide-react';
import type { Program } from '@/lib/program/program.model';
import { NavLink, useSearchParams } from 'react-router';
import { ROUTES } from '@/lib/consts';

export function ProgramRow({ program }: { program: Program }) {
	const [searchParams] = useSearchParams();
	return (
		<li className="flex gap-2 w-full hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-gray-900">
			<NavLink
				to={`${ROUTES.PROGRAMS}/${program.id}?${searchParams.toString()}`}
				className="flex gap-2 flex-1"
			>
				<div className="shrink-0 size-14 bg-green-500 rounded"></div>

				<GText className="flex-1">{program.name}</GText>
			</NavLink>
			<ProgramFormButton program={program} color="white" size="p-1" className="self-start">
				<EllipsisVerticalIcon className="size-4" />
			</ProgramFormButton>
		</li>
	);
}
