import GText from '@/components/GText';
import { useCRUDWorkouts } from '@/lib/workout/workout.hook';
import type { Exercise } from '@/lib/exercise/exercise.model';
import { gFormatDate } from '@/lib/consts';
import { ExerciseFormWorkout } from '@/routes/auth/Home/ExerciseRow/ExerciseFormWorkout';
import { useEffect, useState } from 'react';
import type { Workout } from '@/lib/workout/workout.model';

interface ExerciseRowWorkoutProps {
	exercise: Exercise;
}

export function ExerciseRowWorkout({ exercise }: ExerciseRowWorkoutProps) {
	const { latestWorkout } = useCRUDWorkouts(exercise.id, gFormatDate(new Date()));
	const [inWorkout, setInWorkout] = useState<Workout>(latestWorkout);

	useEffect(() => {
		setInWorkout(latestWorkout);
	}, [latestWorkout]);

	return (
		<ul className="flex flex-col gap-2 text-sm">
			<ExerciseFormWorkout workout={inWorkout} setWorkout={setInWorkout} />
		</ul>
	);
}
