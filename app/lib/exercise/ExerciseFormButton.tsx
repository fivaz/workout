import GButton from '@/components/GButton';
import { type FormEvent, type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import { useCreateExercise, useUpdateExercise } from '@/lib/exercise/exercise.repository';
import type { Exercise } from '@/lib/exercise/exercise.model';

export function ExerciseFormButton({
	children,
	exercise,
}: PropsWithChildren<{ exercise: Exercise }>) {
	const [isOpen, setIsOpen] = useState(false);
	const { createExercise } = useCreateExercise();
	const { updateExercise } = useUpdateExercise();

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

	return (
		<>
			<GButton type="button" onClick={() => setIsOpen(true)}>
				{children}
			</GButton>
			<GDialog open={isOpen} onClose={setIsOpen}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>Add exercise</DialogTitle>
					<DialogBody>
						<GInput label="name" defaultValue={exercise.name} />
					</DialogBody>
					<DialogActions>
						<GButton onClick={() => setIsOpen(false)}>Cancel</GButton>
						<GButton type="submit">Save</GButton>
					</DialogActions>
				</form>
			</GDialog>
		</>
	);
}
