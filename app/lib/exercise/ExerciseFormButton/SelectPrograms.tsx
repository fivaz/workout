import type { Program } from '@/lib/program/program.model';
import { usePrograms } from '@/lib/program/programContext';
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Label,
} from '@headlessui/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { type JSX, useState } from 'react';
import Badge from '@/lib/exercise/ExerciseFormButton/Badge';

export default function SelectPrograms({
	programsIds,
	setProgramsIds,
}: {
	programsIds: string[];
	setProgramsIds: (programsIds: string[]) => void;
}): JSX.Element {
	const [query, setQuery] = useState('');
	const { programs } = usePrograms();

	const selectedPrograms = programs.filter((program) => programsIds.includes(program.id));

	const filteredPrograms =
		query === ''
			? programs
			: programs.filter((program) => {
					return program.name.toLowerCase().includes(query.toLowerCase());
				});

	return (
		<>
			<Combobox
				multiple
				as="div"
				value={selectedPrograms}
				onChange={(programs) => {
					setProgramsIds(programs.map((program) => program.id));
				}}
				onClose={() => setQuery('')}
			>
				<Label className="block text-sm/6 font-medium dark:text-gray-100 text-gray-700">
					Programs
				</Label>
				<div className="flex flex-wrap gap-2">
					{selectedPrograms.map((program) => (
						<Badge key={program.id}>{program.name}</Badge>
					))}
				</div>
				<div className="relative mt-2">
					<ComboboxInput
						className="rounded-md w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-blue-500 sm:text-sm/6"
						onChange={(event) => setQuery(event.target.value)}
						onBlur={() => setQuery('')}
						displayValue={(program: Program) => program?.name ?? ''}
					/>
					<ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
						<ChevronsUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
					</ComboboxButton>

					{filteredPrograms.length > 0 && (
						<ComboboxOptions className="divide-y divide-gray-300 dark:divide-gray-700 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md dark:bg-neutral-800 bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm">
							{filteredPrograms.map((program) => (
								<ComboboxOption
									key={program.id}
									value={program}
									className="group relative cursor-default py-2 pr-9 pl-3 dark:text-gray-100 text-gray-700 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
								>
									<span className="block truncate group-data-selected:font-semibold">
										{program.name}
									</span>

									<span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
										<CheckIcon className="size-5" aria-hidden="true" />
									</span>
								</ComboboxOption>
							))}
						</ComboboxOptions>
					)}
				</div>
			</Combobox>
		</>
	);
}
