import GText from '@/components/GText';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import { XIcon } from 'lucide-react';
import type { JSX } from 'react';
import { type ChangeEvent, useEffect, useState } from 'react';
import type { Workout } from '@/lib/workout/workout.model';

export function ExerciseFormSets({
	workout,
	setWorkout,
}: {
	workout: Workout;
	setWorkout: (workout: Workout) => void;
}): JSX.Element {
	const [newReps, setNewReps] = useState<number | undefined>(undefined);
	const [newWeight, setNewWeight] = useState<number | undefined>(undefined);

	// Add set when both fields have valid values
	useEffect(() => {
		if (newReps && newWeight) {
			const updatedSets = [...workout.sets, { reps: newReps, weight: newWeight }];
			setWorkout({ ...workout, sets: updatedSets });

			setNewReps(undefined);
			setNewWeight(undefined);
		}
	}, [workout, newReps, newWeight]);

	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		console.log('handleInputChange');
		const { name, value } = e.target;
		const numValue = value === '' ? undefined : Number(value);

		if (name === 'reps') setNewReps(numValue);
		if (name === 'weight') setNewWeight(numValue);
	}

	function handleRemoveSet(indexToRemove: number) {
		const updatedSets = workout.sets.filter((_, index) => index !== indexToRemove);
		setWorkout({ ...workout, sets: updatedSets });
	}

	return (
		<div className="flex flex-col gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md">
			<div className="flex gap-2 flex-2">
				<div className="w-12"></div>
				<GText className="flex-1">Reps</GText>
				<GText className="flex-1">Weight (kg)</GText>
			</div>

			<ul className="flex flex-col gap-2">
				{workout.sets.map((set, index) => (
					<li key={index} className="flex gap-3 flex-2 items-center">
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
	);
}
