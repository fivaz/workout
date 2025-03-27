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
	function handleRemoveSet(indexToRemove: number) {
		const updatedSets = workout.sets.filter((_, index) => index !== indexToRemove);
		setWorkout({ ...workout, sets: updatedSets });
	}

	function handleAddSet(reps: number, weight: number) {
		const updatedSets = [...workout.sets, { reps, weight }];
		setWorkout((workout) => ({ ...workout, sets: updatedSets }));
	}

	function handleNewSet(e: ChangeEvent<HTMLFormElement>) {
		const formData = new FormData(e.currentTarget);

		const reps = Number(formData.get('reps'));
		const weight = Number(formData.get('weight'));

		if (reps && weight) {
			handleAddSet(reps, weight);
			e.currentTarget.reset();
		}
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
			)}

			<form className="flex gap-2" onChange={handleNewSet}>
				<GInput name="reps" type="number" placeholder="Reps" />
				<GInput name="weight" type="number" placeholder="Weight" />
			</form>
		</div>
	);
}
