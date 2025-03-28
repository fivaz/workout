import GButton, { type GButtonProps } from '@/components/GButton';
import { type ChangeEvent, type FormEvent, type PropsWithChildren, useState, useRef } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { cloneDeep } from 'lodash-es';

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

	const { createExercise, updateExercise, deleteExercise } = useExercises();

	function handleOpen() {
		console.log(exercise);
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
			void deleteExercise(inExercise);
			setIsOpen(false);
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

	return (
		<>
			<GButton color={color} className={className} size={size} type="button" onClick={handleOpen}>
				{children}
			</GButton>

			<GDialog open={isOpen} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{inExercise.id ? 'Edit Exercise' : 'Create New Exercise'}</DialogTitle>

					<DialogBody className="flex flex-col gap-4">
						<GInput
							name="name"
							label="Exercise Name"
							value={inExercise.name}
							onChange={handleChange}
							required
						/>

						<div className="space-y-2">
							<input
								ref={fileInputRef}
								name="exerciseImage"
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
						</div>
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
