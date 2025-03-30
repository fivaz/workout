import GButton, { type GButtonProps } from '@/components/GButton';
import { type ChangeEvent, type FormEvent, type PropsWithChildren, useState, useRef } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { cloneDeep } from 'lodash-es';
import SelectPrograms from '@/lib/exercise/ExerciseFormButton/SelectPrograms';
import SelectMuscles from '@/lib/exercise/ExerciseFormButton/SelectMuscles';
import { XIcon } from 'lucide-react';
import { usePrompt } from '@/lib/prompt/prompt-context';

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
	const [imageFile, setImageFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { createPrompt } = usePrompt();

	const { createExercise, updateExercise, deleteExercise } = useExercises();

	function handleOpen() {
		setInExercise(cloneDeep(exercise));
		setImageFile(null);
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			if (inExercise.id) {
				void updateExercise(inExercise, imageFile);
			} else {
				void createExercise(inExercise, imageFile);
			}
			setIsOpen(false);
		} catch (error) {
			console.error('Error saving exercise:', error);
			// You might want to add toast notifications here
		}
	}

	async function handleDelete() {
		try {
			if (
				await createPrompt({
					title: 'Delete exercise',
					message: 'Are you sure you want to delete this exercise?',
				})
			) {
				void deleteExercise(inExercise);
				setIsOpen(false);
			}
		} catch (error) {
			console.error('Error deleting exercise:', error);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setInExercise((prev) => ({ ...prev, [name]: value }));
	}

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.currentTarget.files) {
			setImageFile(e.currentTarget.files?.[0]);
			inExercise.image = URL.createObjectURL(e.currentTarget.files?.[0]);
		}
	}

	function handleProgramsChange(programsIds: string[]) {
		setInExercise((prev) => ({ ...prev, programsIds }));
	}

	function handleMusclesChange(muscles: string[]) {
		setInExercise((prev) => ({ ...prev, muscles }));
	}

	return (
		<>
			<GButton color={color} className={className} size={size} type="button" onClick={handleOpen}>
				{children}
			</GButton>

			<GDialog open={isOpen} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{inExercise.id ? 'Edit Exercise' : 'Create New Exercise'}</DialogTitle>

					<GButton
						type="button"
						color="white"
						size="p-1 absolute top-0 right-0 mt-5 mr-5"
						onClick={handleClose}
					>
						<XIcon className="size-5" />
					</GButton>

					<DialogBody className="flex flex-col gap-4">
						<GInput
							name="name"
							label="Exercise Name"
							value={inExercise.name}
							onChange={handleChange}
							required
						/>

						<SelectMuscles setMuscles={handleMusclesChange} muscles={inExercise.muscles} />

						<SelectPrograms
							setProgramsIds={handleProgramsChange}
							programsIds={inExercise.programsIds}
						/>

						<GInput
							ref={fileInputRef}
							name="image"
							label="image"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
						/>
						{inExercise.image && (
							<div className="mt-2 flex justify-center">
								<img
									src={inExercise.image}
									alt="Exercise preview"
									className="max-h-40 max-w-full rounded object-contain"
								/>
							</div>
						)}
					</DialogBody>

					<DialogActions className="flex justify-between">
						{inExercise.id && (
							<GButton type="button" color="red" onClick={handleDelete}>
								Delete
							</GButton>
						)}
						<GButton type="submit">{inExercise.id ? 'Save Changes' : 'Create Exercise'}</GButton>
					</DialogActions>
				</form>
			</GDialog>
		</>
	);
}
