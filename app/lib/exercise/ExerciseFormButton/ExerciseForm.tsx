import GButton from '@/components/GButton';
import {
	type ChangeEvent,
	type Dispatch,
	type FormEvent,
	type SetStateAction,
	useRef,
	useState,
} from 'react';
import { DialogActions, DialogBody, DialogTitle } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import SelectPrograms from '@/lib/exercise/ExerciseFormButton/SelectPrograms';
import SelectMuscles from '@/lib/exercise/ExerciseFormButton/SelectMuscles';
import { XIcon } from 'lucide-react';
import { usePrompt } from '@/lib/prompt/prompt.hook';

type ExerciseFormProps = {
	setExercise: Dispatch<SetStateAction<Exercise>>;
	exercise: Exercise;
	close: () => void;
};

export function ExerciseForm({ setExercise, exercise, close }: ExerciseFormProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const { createPrompt } = usePrompt();

	const { createExercise, updateExercise, deleteExercise } = useExercises();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			if (exercise.id) {
				void updateExercise(exercise, imageFile);
			} else {
				void createExercise(exercise, imageFile);
			}
			close();
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
				void deleteExercise(exercise);
				close();
			}
		} catch (error) {
			console.error('Error deleting exercise:', error);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setExercise((prev) => ({ ...prev, [name]: value }));
	}

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.currentTarget.files) {
			const image = e.currentTarget.files?.[0];
			setImageFile(image);
			setExercise((prev) => ({ ...prev, image: URL.createObjectURL(image) }));
		}
	}

	function handleProgramsChange(programsIds: string[]) {
		setExercise((prev) => ({ ...prev, programsIds }));
	}

	function handleMusclesChange(muscles: string[]) {
		setExercise((prev) => ({ ...prev, muscles }));
	}

	return (
		<form onSubmit={handleSubmit}>
			<DialogTitle>{exercise.id ? 'Edit Exercise' : 'Create New Exercise'}</DialogTitle>

			<GButton
				type="button"
				color="white"
				size="p-1 absolute top-0 right-0 mt-5 mr-5"
				onClick={close}
			>
				<XIcon className="size-5" />
			</GButton>

			<DialogBody className="flex flex-col gap-4">
				<GInput
					name="name"
					label="Exercise Name"
					value={exercise.name}
					onChange={handleChange}
					required
				/>

				<SelectMuscles setMuscles={handleMusclesChange} muscles={exercise.muscles} />

				<SelectPrograms setProgramsIds={handleProgramsChange} programsIds={exercise.programsIds} />

				<GInput
					ref={fileInputRef}
					name="image"
					label="image"
					type="file"
					accept="image/*"
					onChange={handleImageChange}
				/>
				{exercise.image && (
					<div className="mt-2 flex justify-center">
						<img
							src={exercise.image}
							alt="Exercise preview"
							className="max-h-40 max-w-full rounded object-contain"
						/>
					</div>
				)}
			</DialogBody>

			<DialogActions className="flex justify-between">
				{exercise.id && (
					<GButton type="button" color="red" onClick={handleDelete}>
						Delete
					</GButton>
				)}
				<GButton type="submit">{exercise.id ? 'Save Changes' : 'Create Exercise'}</GButton>
			</DialogActions>
		</form>
	);
}
