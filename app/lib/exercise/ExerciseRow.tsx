import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { XIcon } from 'lucide-react';
import type { Exercise } from './exercise.model';
import { useDeleteExercise, useUpdateExercise } from '@/lib/exercise/exercise.repository';
import type { FormEvent, FormEventHandler } from 'react';

export function ExerciseRow({ exercise }: { exercise: Exercise }) {
	const { deleteExercise } = useDeleteExercise();
	const { updateExercise } = useUpdateExercise();

	function handleDelete(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		void deleteExercise(exercise.id);
	}

	return (
		<li className="flex flex-col gap-2 p-2 border border-gray-200 dark:border-gray-500 rounded-md">
			<div className="flex gap-2">
				<form className="flex-1" method="post">
					<GInput name="name" defaultValue={exercise.name || 'no name'} />
				</form>

				<form onSubmit={handleDelete}>
					<GInput name="id" defaultValue={exercise.id} type="hidden" />
					<GButton type="submit">Del</GButton>
				</form>
			</div>

			<div className="flex flex-col gap-3">
				<ul className="flex flex-col gap-2">
					<div className="flex gap-2">
						<div className="w-6"></div>
						<GText className="flex-1">Reps</GText>
						<GText className="flex-1">Weight</GText>
					</div>
					{/*{exercise.sets &&*/}
					{/*	exercise.sets.length > 0 &&*/}
					{/*	exercise.sets.map((set, index) => (*/}
					{/*		<li key={set.id} className="flex gap-2 items-center">*/}
					{/*			<GText className="w-6">{index + 1}</GText>*/}
					{/*			<GInput name="reps" type="number" defaultValue={set.reps} />*/}
					{/*			<GInput name="weight" type="number" defaultValue={set.weight} />*/}
					{/*			<form*/}
					{/*				method="post"*/}
					{/*				action={`/server/exercise/${exercise.id}/sets/${set.id}/delete`}*/}
					{/*			>*/}
					{/*				<GButton type="submit" color="white" size="p-1.5">*/}
					{/*					<XIcon className="size-5 text-red-500" />*/}
					{/*				</GButton>*/}
					{/*			</form>*/}
					{/*		</li>*/}
					{/*	))}*/}
				</ul>

				<div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600" />

				{/*<form*/}
				{/*	method="post"*/}
				{/*	action={`/server/exercise/${exercise.id}/sets`}*/}
				{/*	className="flex flex-col gap-2"*/}
				{/*	ref={addSetFormRef}*/}
				{/*>*/}
				{/*	<div className="flex gap-2">*/}
				{/*		<GText className="w-6">{(exercise.sets?.length || 0) + 1}</GText>*/}
				{/*		<GInput name="reps" type="number" />*/}
				{/*		<GInput name="weight" type="number" />*/}
				{/*	</div>*/}
				{/*	<GButton type="submit">Add Set</GButton>*/}
				{/*</form>*/}
			</div>
		</li>
	);
}
