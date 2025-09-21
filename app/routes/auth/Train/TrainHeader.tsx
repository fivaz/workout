import { BellElectricIcon, EllipsisVerticalIcon, PlusIcon } from 'lucide-react';

import { ExerciseFormButton } from '@/lib/exercise/ExerciseFormButton/ExerciseFormButton';

import WorkoutTimer from '@/routes/auth/Train/WorkoutTimer';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/GDropDown';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { buildEmptyExercise } from '@/lib/exercise/exercise.model';
import type { Program } from '@/lib/program/program.model';
import { useSessions } from '@/lib/session/sessionContext';
import { ROUTES } from '@/lib/consts';
import { useNavigate } from 'react-router';

type TrainHeaderProps = {
	selectedProgram: Program;
};

export default function TrainHeader({ selectedProgram }: TrainHeaderProps) {
	const newExercise = buildEmptyExercise(selectedProgram);
	const { endSession } = useSessions();
	const navigate = useNavigate();

	const handleEndSession = () => {
		endSession(selectedProgram.id);

		navigate(ROUTES.REPORT(selectedProgram.id));
	};

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
						<DropdownItem as={GButton} color="none" onClick={handleEndSession}>
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
