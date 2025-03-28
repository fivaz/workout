import GButton, { type GButtonProps } from '@/components/GButton';
import { type ChangeEvent, type FormEvent, type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import 'react-toastify/dist/ReactToastify.css';

type ExerciseFormButtonProps = PropsWithChildren<{ exercise: Exercise } & GButtonProps>;

export function ExerciseFormButton({
	children,
	exercise,
	color,
	className,
	size,
}: ExerciseFormButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [inExercise, setInExercise] = useState<Exercise>(exercise);

	const { createExercise, updateExercise, deleteExercise } = useExercises();

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (inExercise.id) {
			updateExercise(inExercise);
		} else {
			createExercise(inExercise);
		}
		setIsOpen(false);
	}

	function handleDelete() {
		deleteExercise(exercise.id);
		setIsOpen(false);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const newName = e.target.value;
		setInExercise((prevExercise) => ({
			...prevExercise,
			name: newName,
		}));
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
					<DialogBody className="flex flex-col gap-3">
						<GInput name="name" label="name" defaultValue={exercise.name} onChange={handleChange} />
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
