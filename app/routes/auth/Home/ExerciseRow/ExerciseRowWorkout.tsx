import { useCRUDWorkouts } from '@/lib/workout/workout.hook';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { gFormatDate } from '@/lib/consts';
import GButton from '@/components/GButton';
import { PlusIcon, XIcon } from 'lucide-react';
import GInput from '@/components/GInput';
import GText from '@/components/GText';
import { buildEmptyWorkout, type Workout, type WorkoutSet } from '@/lib/workout/workout.model';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash-es';

interface ExerciseRowWorkoutProps {
	exercise: Exercise;
}

export function ExerciseRowWorkout({ exercise }: ExerciseRowWorkoutProps) {
	const { latestWorkout, setLatestWorkout, updateWorkout } = useCRUDWorkouts(
		exercise.id,
		gFormatDate(new Date()),
	);

	// Memoize the debounced update function
	const debouncedUpdateWorkout = useCallback(
		(workout: Workout) => {
			const debouncedFn = debounce(() => updateWorkout(workout), 1000);
			debouncedFn();
		},
		[updateWorkout],
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

	function handleDeleteSet(index: number): void {
		setLatestWorkout((prevWorkout) => {
			const newSets = [...prevWorkout.sets];
			newSets.splice(index, 1);
			const updatedWorkout = { ...prevWorkout, sets: newSets };
			debouncedUpdateWorkout(updatedWorkout); // Persist changes to Firestore
			return updatedWorkout;
		});
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
				<p className="w-6"></p>
				<p className="text-center">Reps</p>
				<p className="text-center">Weight</p>
				<p className="text-center">Time</p>
				<p className="w-6"></p>
			</li>
			{latestWorkout.sets.map((set, index) => (
				<li
					className="w-full grid gap-2 items-center"
					style={{
						gridTemplateColumns: '24px 1fr 1fr minmax(70px, 1fr) 30px',
					}}
					key={set.time || index}
				>
					<GText>{index}</GText>
					<GInput
						className="w-full"
						type="number"
						value={set.reps}
						onChange={(e) => handleChange(index, 'reps', e.target.value)}
					/>
					<GInput
						className="w-full"
						type="number"
						value={set.weight}
						onChange={(e) => handleChange(index, 'weight', e.target.value)}
					/>
					<GInput
						className="w-full"
						type="time"
						value={set.time}
						onChange={(e) => handleChange(index, 'time', e.target.value)}
					/>
					<GButton color="white" size="p-1.5" onClick={() => handleDeleteSet(index)}>
						<XIcon className="size-4" />
					</GButton>
				</li>
			))}
			<GButton color="none" className="w-full" onClick={handleAddNewSet}>
				<div className="relative">
					<div aria-hidden="true" className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center">
						<span className="dark:bg-gray-900 bg-gray-50 px-2 text-gray-500">
							<PlusIcon aria-hidden="true" className="size-4 text-gray-500" />
						</span>
					</div>
				</div>
			</GButton>
		</ul>
	);
}
