import GButton, { type GButtonProps } from '@/components/GButton';
import { type FormEvent, type PropsWithChildren, useEffect, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ExerciseFormButton({
	children,
	exercise,
	color,
	className,
	size,
}: PropsWithChildren<{ exercise: Exercise } & GButtonProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const { createExercise, updateExercise, deleteExercise, loading, error, success } =
		useExercises();

	useEffect(() => {
		if (error) {
			toast.error(error, {
				toastId: 'exercise-error', // Unique ID to prevent duplicates
			});
		} else if (success) {
			toast.success(success, {
				toastId: 'exercise-success', // Unique ID to prevent duplicates
			});
			setIsOpen(false); // Close dialog on success
		}
	}, [loading, error, success]);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

	async function handleDelete() {
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
					<DialogTitle>{exercise.id ? 'Edit' : 'Create'} exercise</DialogTitle>
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
