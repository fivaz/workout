import {
	BellElectricIcon,
	ChevronDownIcon,
	EllipsisIcon,
	EllipsisVerticalIcon,
	PlusIcon,
} from 'lucide-react';

import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';

import WorkoutTimer from '@/routes/auth/Train/WorkoutTimer';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/GDropDown';
import { Link } from '@/components/link';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { move } from '@dnd-kit/helpers';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import type { Program } from '@/lib/program/program.model';

type TrainHeaderProps = {
	selectedProgram: Program;
};

export default function TrainHeader({ selectedProgram }: TrainHeaderProps) {
	const newExercise = buildEmptyExercise(selectedProgram);

	return (
		<div className="flex items-center justify-between gap-2">
			<GText tag="h1" className="truncate text-lg">
				{selectedProgram.name}
			</GText>
			<div className="flex items-center gap-2">
				<WorkoutTimer />
				<Dropdown>
					<DropdownButton size="px-1.5 py-1">
						<EllipsisVerticalIcon className="size-5" />
					</DropdownButton>
					<DropdownMenu>
						<DropdownItem as={ExerciseFormButton} exercise={newExercise} color="none">
							<div className="flex items-center gap-2">
								<PlusIcon className="size-5" />
								Exercise
							</div>
						</DropdownItem>
						<DropdownItem as={GButton} color="none" onClick={() => console.log('end workout')}>
							<div className="flex items-center gap-2">
								<BellElectricIcon className="size-5" />
								End workout
							</div>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
}
