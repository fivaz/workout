import { useCRUDWorkouts } from '@/lib/workout/workout.hook';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { gFormatDate } from '@/lib/consts';
import GButton from '@/components/GButton';
import { PlusIcon, XIcon } from 'lucide-react';
import GInput from '@/components/GInput';
import GText from '@/components/GText';
import { type Workout, type WorkoutSet } from '@/lib/workout/workout.model';
import { useCallback } from 'react';
import { debounce } from 'lodash-es';
import { usePrompt } from '@/lib/prompt/prompt.hook';

interface ExerciseRowWorkoutProps {
	exercise: Exercise;
	setLoading: (loading: boolean) => void;
}

export function ExerciseRowWorkout({ exercise, setLoading }: ExerciseRowWorkoutProps) {
	const { latestWorkout, setLatestWorkout, updateWorkout } = useCRUDWorkouts(
		exercise.id,
		gFormatDate(new Date()),
	);

	const { createPrompt } = usePrompt();

	// Memoize the debounced update function
	const debouncedUpdateWorkout = useCallback(
		(workout: Workout) => {
			const debouncedFn = debounce(async () => {
				setLoading(true);
				await updateWorkout(workout);
				setLoading(false);
			}, 1000);
			void debouncedFn();
		},
		[setLoading, updateWorkout],
	);

	function handleChange(index: number, field: keyof WorkoutSet, value: string) {
		setLatestWorkout((prevWorkout) => {
			const newSets = [...prevWorkout.sets];
			newSets[index] = { ...newSets[index], [field]: value };
			const updatedWorkout = { ...prevWorkout, sets: newSets };
			debouncedUpdateWorkout(updatedWorkout);
			return updatedWorkout;
		});
	}

	function deleteSet(index: number): void {
		setLatestWorkout((prevWorkout) => {
			const newSets = [...prevWorkout.sets];
			newSets.splice(index, 1);
			const updatedWorkout = { ...prevWorkout, sets: newSets };
			debouncedUpdateWorkout(updatedWorkout);
			return updatedWorkout;
		});
	}

	// Main async function to handle deletion logic
	async function handleDeleteSet(index: number): Promise<void> {
		// Get the current workout state
		const setToDelete = latestWorkout.sets[index];

		// Check if all three keys (time, reps, weight) are falsy
		const isEmptySet = !setToDelete.time && !setToDelete.reps && !setToDelete.weight;

		if (isEmptySet) {
			// If all fields are falsy, delete immediately
			deleteSet(index);
			return;
		}

		// If any field has a value, prompt for confirmation
		try {
			const confirmed = await createPrompt({
				title: 'Delete set',
				message: 'Are you sure you want to delete this set?',
			});

			if (confirmed) {
				deleteSet(index); // Call the helper function after confirmation
			}
		} catch (error) {
			console.error('Error during set deletion prompt:', error);
		}
	}

	function handleAddNewSet(): void {
		const newSet: WorkoutSet = {
			reps: '',
			weight: '',
			time: '',
		};

		setLatestWorkout((prevWorkout) => {
			const newSets = [...prevWorkout.sets, newSet];
			const updatedWorkout = { ...prevWorkout, sets: newSets };
			debouncedUpdateWorkout(updatedWorkout); // Persist changes to Firestore
			return updatedWorkout;
		});
	}

	return (
		<ul className="w-full text-sm dark:text-gray-300 flex flex-col gap-2">
			<li
				className="w-full grid gap-2 items-center"
				style={{
					gridTemplateColumns: '24px 1fr 1fr minmax(70px, 1fr) 30px',
				}}
			>
				<p></p>
				<GText className="text-center">Reps</GText>
				<GText className="text-center">Weight</GText>
				<GText className="text-center">Time</GText>
				<p></p>
			</li>
			{latestWorkout.sets.map((set, index) => (
				<li
					className="w-full grid gap-2 items-center"
					style={{
						gridTemplateColumns: '24px 1fr 1fr minmax(70px, 1fr) 30px',
					}}
					key={index}
				>
					<GText>{index + 1}</GText>
					<GInput
						className="w-full h-9"
						type="number"
						value={set.reps}
						onChange={(e) => handleChange(index, 'reps', e.target.value)}
					/>
					<GInput
						className="w-full h-9"
						type="number"
						value={set.weight}
						onChange={(e) => handleChange(index, 'weight', e.target.value)}
					/>
					<GInput
						className="w-full h-9"
						type="time"
						value={set.time}
						onChange={(e) => handleChange(index, 'time', e.target.value)}
					/>
					<GButton color="white" size="p-1.5" onClick={() => void handleDeleteSet(index)}>
						<XIcon className="size-4" />
					</GButton>
				</li>
			))}
			<GButton color="none" className="w-full" onClick={handleAddNewSet}>
				<div className="relative">
					<div aria-hidden="true" className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300 dark:border-gray-600" />
					</div>
					<div className="relative flex justify-center">
						<span className="dark:bg-gray-900 bg-gray-50 px-2 text-gray-500 rounded-lg border border-gray-300 dark:border-gray-600">
							<PlusIcon aria-hidden="true" className="size-4 text-gray-500 dark:text-gray-400" />
						</span>
					</div>
				</div>
			</GButton>
		</ul>
	);
}
