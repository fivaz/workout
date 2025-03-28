import GButton, { type GButtonProps } from '@/components/GButton';
import { type ChangeEvent, type FormEvent, type PropsWithChildren, useState, useRef } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import 'react-toastify/dist/ReactToastify.css';

type ExerciseFormButtonProps = PropsWithChildren<
	{
		exercise: Exercise;
	} & GButtonProps
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
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(exercise.image || null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { createExercise, updateExercise, deleteExercise } = useExercises();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			if (inExercise.id) {
				// Update existing exercise
				void updateExercise(inExercise, imageFile);
			} else {
				// Create new exercise
				void createExercise(inExercise, imageFile);
			}
			setIsOpen(false);
			resetForm();
		} catch (error) {
			console.error('Error saving exercise:', error);
			// You might want to add toast notifications here
		}
	}

	async function handleDelete() {
		try {
			await deleteExercise(inExercise);
			setIsOpen(false);
			resetForm();
		} catch (error) {
			console.error('Error deleting exercise:', error);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setInExercise((prev) => ({ ...prev, [name]: value }));
	}

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || null;
		setImageFile(file);

		if (file) {
			// Create preview
			const reader = new FileReader();
			reader.onload = (event) => {
				setPreviewImage(event.target?.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			// Reset to existing image if available
			setPreviewImage(inExercise.image || null);
		}
	}

	function resetForm() {
		setInExercise(exercise);
		setImageFile(null);
		setPreviewImage(exercise.image || null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
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

			<GDialog
				open={isOpen}
				onClose={() => {
					setIsOpen(false);
					resetForm();
				}}
			>
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
							{previewImage && (
								<div className="mt-2 flex justify-center">
									<img
										src={previewImage}
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
