import { useCRUDSets } from '@/lib/set/set.hook';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { gFormatDate } from '@/lib/consts';
import GButton from '@/components/GButton';
import { XIcon } from 'lucide-react';
import GInput from '@/components/GInput';
import GText from '@/components/GText';

interface ExerciseRowWorkoutProps {
	exercise: Exercise;
}

export function ExerciseRowSets({ exercise }: ExerciseRowWorkoutProps) {
	const { latestSets, setLatestSets, deleteSet } = useCRUDSets(
		exercise.id,
		gFormatDate(new Date()),
	);

	function handleChange() {}

	function handleDeleteSet(index: number): void {
		const setId = latestSets[index].id;

		if (setId) {
			deleteSet(setId);
		} else {
			setLatestSets((prevSets) => {
				const newSets = [...prevSets];
				newSets.splice(index, 1);
				return newSets;
			});
		}
	}

	return (
		<ul className="text-sm dark:text-gray-300">
			<li className="flex gap-2 items-center justify-between">
				<p className="w-6"></p>
				<p className="w-15 text-center">Reps</p>
				<p className="w-15 text-center">Weight (kg)</p>
				<p className="w-15 text-center">Rest (min)</p>
				<p className="w-6"></p>
			</li>
			{latestSets.map((set, index) => (
				<li className="flex gap-2 items-center justify-between" key={set.id || index}>
					<GText className="w-6">{index}</GText>
					<GInput className="w-15" value={set.reps} onChange={handleChange} />
					<GInput className="w-15" value={set.weight} onChange={handleChange} />
					<GText className="w-15 text-center">{set.date}</GText>
					<GButton color="white" size="p-1.5" onClick={() => handleDeleteSet(index)}>
						<XIcon className="size-4" />
					</GButton>
				</li>
			))}
		</ul>
	);
}
