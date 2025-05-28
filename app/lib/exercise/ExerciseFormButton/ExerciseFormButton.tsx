import GButton, { type GButtonProps } from '@/components/GButton';
import { type PropsWithChildren, useState } from 'react';
import { GDialog } from '@/components/GDialog';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { cloneDeep } from 'lodash-es';
import { PlusIcon } from 'lucide-react';
import { ExerciseForm } from '@/lib/exercise/ExerciseFormButton/ExerciseForm';

type ExerciseFormButtonProps = PropsWithChildren<
	{ exercise: Exercise } & Omit<GButtonProps, 'children'>
>;

export function ExerciseFormButton({
	children,
	exercise,
	color,
	className,
	size,
}: ExerciseFormButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [inExercise, setInExercise] = useState<Exercise>(exercise);

	function handleOpen() {
		setInExercise(cloneDeep(exercise));
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	return (
		<>
			<GButton color={color} className={className} size={size} type="button" onClick={handleOpen}>
				{children || (
					<>
						<PlusIcon className="size-5" />
						Exercise
					</>
				)}
			</GButton>

			<GDialog open={isOpen} onClose={handleClose}>
				<ExerciseForm exercise={inExercise} setExercise={setInExercise} close={handleClose} />
			</GDialog>
		</>
	);
}
