import GText from '@/components/GText';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import { XIcon } from 'lucide-react';
import type { Dispatch, JSX, SetStateAction } from 'react';
import { type ChangeEvent, useEffect, useState } from 'react';
import type { Workout } from '@/lib/workout/workout.model';

export function ExerciseFormWorkout({
	workout,
	setWorkout,
}: {
	workout: Workout;
	setWorkout: Dispatch<SetStateAction<Workout>>;
}): JSX.Element {
	const [newReps, setNewReps] = useState<number | ''>('');
	const [newWeight, setNewWeight] = useState<number | ''>('');

	// Add a new set when both reps and weight are updated
	useEffect(() => {
		if (newReps !== '' && newWeight !== '' && newReps > 0 && newWeight > 0) {
			const updatedSets = [...workout.sets, { reps: newReps, weight: newWeight }];
			setWorkout((prev) => ({ ...prev, sets: updatedSets }));
			setNewReps(''); // Reset inputs
			setNewWeight('');
		}
	}, [newReps, newWeight, workout.sets, setWorkout]);

	function handleRemoveSet(indexToRemove: number) {
		const updatedSets = workout.sets.filter((_, index) => index !== indexToRemove);
		setWorkout({ ...workout, sets: updatedSets });
	}

	function handleSetChange(index: number, e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		const numValue = Number(value);
		if (isNaN(numValue)) return; // Ignore invalid numbers

		const updatedSets = workout.sets.map((set, i) =>
			i === index ? { ...set, [name]: numValue } : set,
		);
		setWorkout({ ...workout, sets: updatedSets });
	}

	return (
		<div className="flex flex-col gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md">
			<div className="flex gap-2 flex-2">
				<div className="w-12"></div>
				<GText className="flex-1">Reps</GText>
				<GText className="flex-1">Weight (kg)</GText>
			</div>

			{workout.sets.length > 0 && (
				<ul className="flex flex-col gap-2">
					{workout.sets.map((set, index) => (
						<li key={index} className="flex gap-3 flex-2 items-center">
							<GText className="w-15 px-1.5">{index + 1}</GText>
							<GInput
								name="reps"
								type="number"
								value={set.reps}
								onChange={(e) => handleSetChange(index, e)}
							/>
							<GInput
								name="weight"
								type="number"
								value={set.weight}
								onChange={(e) => handleSetChange(index, e)}
							/>
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
			)}

			<div className="flex gap-2">
				<GInput
					name="reps"
					type="number"
					placeholder="Reps"
					value={newReps}
					onChange={(e) => setNewReps(Number(e.target.value) || '')}
				/>
				<GInput
					name="weight"
					type="number"
					placeholder="Weight"
					value={newWeight}
					onChange={(e) => setNewWeight(Number(e.target.value) || '')}
				/>
			</div>
		</div>
	);
}
