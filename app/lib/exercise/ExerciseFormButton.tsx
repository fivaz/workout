import GButton, { type GButtonProps } from '@/components/GButton';
import { type FormEvent, type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import {
	useCreateExercise,
	useDeleteExercise,
	useUpdateExercise,
} from '@/lib/exercise/exercise.repository';
import type { Exercise } from '@/lib/exercise/exercise.model';

export function ExerciseFormButton({
	children,
	exercise,
	color,
	className,
	size,
}: PropsWithChildren<{ exercise: Exercise } & GButtonProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const { createExercise } = useCreateExercise();
	const { updateExercise } = useUpdateExercise();
	const { deleteExercise } = useDeleteExercise();

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const newExercise: Exercise = {
			id: exercise.id,
			name: formData.get('name') as string,
		};
		if (newExercise.id) {
			void updateExercise(newExercise);
		} else {
			void createExercise(newExercise);
		}
	}

	function handleDelete() {
		void deleteExercise(exercise.id);
	}

	return (
		<>
			<GButton
				color={color}
				className={className}
				size={size}
				type="button"
				onClick={() => setIsOpen(true)}
			>
				{children}
			</GButton>
			<GDialog open={isOpen} onClose={setIsOpen}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{exercise.id ? 'Add' : 'Create'} exercise</DialogTitle>
					<DialogBody>
						<GInput label="name" defaultValue={exercise.name} />
					</DialogBody>
					<DialogActions className="flex justify-between">
						{exercise.id && (
							<GButton type="button" color="red" onClick={handleDelete}>
								Delete
							</GButton>
						)}
						<GButton type="submit">Save</GButton>
					</DialogActions>
				</form>
			</GDialog>
		</>
	);
}
