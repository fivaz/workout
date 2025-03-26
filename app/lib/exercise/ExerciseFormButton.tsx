import GButton, { type GButtonProps } from '@/components/GButton';
import { type FormEvent, type PropsWithChildren, useEffect, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Don't forget to include the CSS

export function ExerciseFormButton({
	children,
	exercise,
	color,
	className,
	size,
}: PropsWithChildren<{ exercise: Exercise } & GButtonProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const { createExercise, updateExercise, deleteExercise, loading, error } = useExercises();

	// Add useEffect to handle loading and error states
	useEffect(() => {
		let toastId: string | number | null = null;

		if (loading) {
			toastId = toast.loading('Processing...');
		} else if (error) {
			toast.error(error, {
				toastId: 'exercise-error', // Unique ID to prevent duplicate error toasts
			});
		}

		// Cleanup function to dismiss loading toast when loading is complete
		return () => {
			if (toastId !== null) {
				toast.dismiss(toastId);
			}
		};
	}, [loading, error]);

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
