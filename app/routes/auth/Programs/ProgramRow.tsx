import GText from '@/components/GText';
import { ExerciseFormButton } from '@/routes/auth/Home/ExerciseRow/ExerciseFormButton';
import { EllipsisVerticalIcon } from 'lucide-react';
import { ExerciseRowWorkout } from '@/routes/auth/Home/ExerciseRow/ExerciseRowWorkout';
import type { Program } from '@/lib/program/program.model';

export function ProgramRow({ program }: { program: Program }) {
	return (
		<li className="w-full flex gap-2 hover-group hover:bg-gray-300 dark:hover:bg-gray-900 p-2 border border-gray-200 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-gray-900">
			<div className="shrink-0 size-14 bg-green-500 rounded"></div>

			<div className="flex flex-col gap-3 flex-1">
				<div className="flex gap-2">
					<GText className="flex-1">{program.name}</GText>
					{/*<ExerciseFormButton exercise={exercise} color="white" size="p-1">*/}
					{/*    <EllipsisVerticalIcon className="size-4" />*/}
					{/*</ExerciseFormButton>*/}
				</div>
			</div>
		</li>
	);
}
