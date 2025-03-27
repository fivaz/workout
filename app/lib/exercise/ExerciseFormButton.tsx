import GButton, { type GButtonProps } from '@/components/GButton';
import {
	type ChangeEvent,
	type FormEvent,
	type PropsWithChildren,
	useEffect,
	useState,
} from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Exercise } from '@/lib/exercise/exercise.model';
import type { Set } from '@/lib/set/set.model';
import { useExercises } from '@/lib/exercise/exerciseContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GText from '@/components/GText';
import { XIcon } from 'lucide-react';

export function ExerciseFormButton({
	children,
	exercise,
	sets: initialSets,
	color,
	className,
	size,
}: PropsWithChildren<{ exercise: Exercise; sets: Set[] } & GButtonProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [sets, setSets] = useState<Set[]>(initialSets || []);
	const [newReps, setNewReps] = useState<number | undefined>(undefined);
	const [newWeight, setNewWeight] = useState<number | undefined>(undefined);
	const { createExercise, updateExercise, deleteExercise, loading, error, success } =
		useExercises();

	useEffect(() => {
		if (error) {
			toast.error(error, {
				toastId: 'exercise-error',
			});
		} else if (success) {
			toast.success(success, {
				toastId: 'exercise-success',
			});
			setIsOpen(false);
		}
	}, [loading, error, success]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const numValue = value === '' ? undefined : Number(value);

		if (name === 'reps') setNewReps(numValue);
		if (name === 'weight') setNewWeight(numValue);

		// Add set when both fields have valid values
		if ((name === 'reps' && numValue && newWeight) || (name === 'weight' && numValue && newReps)) {
			if (numValue! > 0 && (name === 'reps' ? newWeight! : newReps!) > 0) {
				const newSet: Set = {
					id: crypto.randomUUID(),
					reps: name === 'reps' ? numValue! : newReps!,
					weight: name === 'weight' ? numValue! : newWeight!,
				};
				setSets((prev) => [...prev, newSet]);
				setNewReps(undefined);
				setNewWeight(undefined);
			}
		}
	};

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const newExercise: Exercise = {
			id: exercise.id,
			name: formData.get('name') as string,
		};

		if (newExercise.id) {
			updateExercise(newExercise);
		} else {
			createExercise(newExercise);
		}
	}

	function handleDelete() {
		deleteExercise(exercise.id);
	}

	const handleRemoveSet = (indexToRemove: number) => {
		setSets((prevSets) => prevSets.filter((_, index) => index !== indexToRemove));
	};
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
						<div className="flex flex-col gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md">
							<div className="flex gap-2 flex-2">
								<div className="w-12"></div>
								<GText className="flex-1">Reps</GText>
								<GText className="flex-1">Weight (kg)</GText>
							</div>

							<ul className="flex flex-col gap-2">
								{sets.map((set, index) => (
									<li key={set.id} className="flex gap-3 flex-2 items-center">
										<GText className="w-15 px-1.5">{index + 1}</GText>
										<GInput name="reps" type="number" defaultValue={set.reps} />
										<GInput name="weight" type="number" defaultValue={set.weight} />
										<GButton
											className="w-14"
											size="p-1.5"
											color="white"
											type="button"
											onClick={() => handleRemoveSet(index)}
										>
											<XIcon className="size-5" />
										</GButton>
									</li>
								))}
							</ul>

							<div className="flex gap-2 mt-2">
								<GInput
									name="reps"
									type="number"
									value={newReps ?? ''}
									onChange={handleInputChange}
									placeholder="Reps"
								/>
								<GInput
									name="weight"
									type="number"
									value={newWeight ?? ''}
									onChange={handleInputChange}
									placeholder="Weight"
								/>
							</div>
						</div>
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
