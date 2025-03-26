import type { Exercise } from '@/routes/auth/exercise/model';
import GInput from '@/components/GInput';
import { useFetcher, useSubmit } from 'react-router';
import GButton from '@/components/GButton';
import GText from '@/components/GText';
import { PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ExerciseRow({ exercise }: { exercise: Exercise }) {
	const fetcher = useFetcher();

	const submit = useSubmit();

	const addSetFormRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data && addSetFormRef.current) {
			console.log('yes');
			addSetFormRef.current.reset(); // Reset the form when submission is complete
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<li className="flex flex-col gap-2 p-2 border border-gray-200 dark:border-gray-500 rounded-md">
			<div className="flex gap-2">
				<fetcher.Form
					className="flex-1"
					method="post"
					onChange={(event) => {
						submit(event.currentTarget);
					}}
					action="/"
				>
					<GInput name="id" defaultValue={exercise.id} type="hidden" />
					<GInput name="name" defaultValue={exercise.name || 'error'} />
				</fetcher.Form>

				<fetcher.Form method="post" action={`/exercise/${exercise.id}/delete`}>
					<GInput name="id" defaultValue={exercise.id} type="hidden" />
					<GButton type="submit">Del</GButton>
				</fetcher.Form>
			</div>

			<div className="flex flex-col gap-3">
				<ul className="flex flex-col gap-2">
					<div className="flex gap-2">
						<div className="w-6"></div>
						<GText className="flex-1">Reps</GText>
						<GText className="flex-1">Weight</GText>
					</div>
					{exercise.sets &&
						exercise.sets.length > 0 &&
						exercise.sets.map((set, index) => (
							<li key={set.id} className="flex gap-2 items-center">
								<GText className="w-6">{index + 1}</GText>
								<GInput name="reps" type="number" defaultValue={set.reps} />
								<GInput name="weight" type="number" defaultValue={set.weight} />
								<fetcher.Form
									method="post"
									action={`/exercise/${exercise.id}/sets/${set.id}/delete`}
								>
									<GButton type="submit" color="white" size="p-1.5">
										<XIcon className="size-5 text-red-500" />
									</GButton>
								</fetcher.Form>
							</li>
						))}
				</ul>

				<div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600" />

				<fetcher.Form
					method="post"
					action={`/exercise/${exercise.id}/sets`}
					className="flex flex-col gap-2"
					ref={addSetFormRef}
				>
					<div className="flex gap-2">
						<GText className="w-6">{(exercise.sets?.length || 0) + 1}</GText>
						<GInput name="reps" type="number" />
						<GInput name="weight" type="number" />
					</div>
					<GButton type="submit">Add Set</GButton>
				</fetcher.Form>
			</div>
		</li>
	);
}
