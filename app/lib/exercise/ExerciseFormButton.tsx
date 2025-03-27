import GButton, { type GButtonProps } from '@/components/GButton';
import { type FormEvent, type PropsWithChildren, useEffect, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Workout } from '@/lib/workout/workout.model';
import { ExerciseFormWorkout } from '@/lib/exercise/ExerciseFormWorkout';

export function ExerciseFormButton({
	children,
	exercise,
	workout,
	color,
	className,
	size,
}: PropsWithChildren<{ exercise: Exercise; workout: Workout } & GButtonProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [inWorkout, setInWorkout] = useState<Workout>(workout);

	const { createExercise, updateExercise, deleteExercise } = useExercises();

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const newExercise: Exercise = {
			id: exercise.id,
			name: formData.get('name') as string,
		};

		if (newExercise.id) {
			updateExercise(newExercise, inWorkout);
		} else {
			createExercise(newExercise, inWorkout);
		}
		setIsOpen(false);
	}

	function handleDelete() {
		deleteExercise(exercise.id);
		setIsOpen(false);
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
						<GInput label="name" defaultValue={exercise.name} />
						<ExerciseFormWorkout workout={inWorkout} setWorkout={setInWorkout} />
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
