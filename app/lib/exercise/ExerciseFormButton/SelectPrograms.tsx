import type { Program } from '@/lib/program/program.model';
import { usePrograms } from '@/lib/program/programContext';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react';
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
	const { programs } = usePrograms();

	const selectedPrograms = programs.filter((program) => programsIds.includes(program.id));

	const programsNames = selectedPrograms.map((program) => program.name).join(',  ');

	return (
		<>
			<Listbox
				multiple
				as="div"
				value={selectedPrograms}
				onChange={(programs) => {
					setProgramsIds(programs.map((program) => program.id));
				}}
			>
				<Label className="block text-sm/6 font-medium text-gray-700 dark:text-gray-100">
					Programs
				</Label>
				<div className="flex flex-wrap gap-2">
					{selectedPrograms.map((program) => (
						<Badge key={program.id}>{program.name}</Badge>
					))}
				</div>
				<div className="relative mt-2">
					<ListboxButton className="flex w-full cursor-default gap-2 rounded-md bg-white px-3 py-1.5 text-left text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-blue-500">
						<span className="h-6 grow truncate pr-6">{programsNames}</span>
						<ChevronsUpDownIcon
							className="size-5 self-center justify-self-end text-gray-500 md:size-4"
							aria-hidden="true"
						/>
					</ListboxButton>

					<ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full divide-y divide-gray-300 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm dark:divide-gray-700 dark:bg-neutral-800">
						{programs.map((program) => (
							<ListboxOption
								key={program.id}
								value={program}
								className="group relative cursor-default py-2 pr-9 pl-3 text-gray-700 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-gray-100"
							>
								<span className="block truncate group-data-selected:font-semibold">
									{program.name}
								</span>

								<span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
									<CheckIcon className="size-5" aria-hidden="true" />
								</span>
							</ListboxOption>
						))}
					</ListboxOptions>
				</div>
			</Listbox>
		</>
	);
}
