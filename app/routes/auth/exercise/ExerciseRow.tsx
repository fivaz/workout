import type { Exercise } from '@/routes/auth/exercise/model';
import GInput from '@/components/GInput';
import { useFetcher, useSubmit } from 'react-router';

export function ExerciseRow({ exercise }: { exercise: Exercise }) {
	const fetcher = useFetcher();

	const submit = useSubmit();

	return (
		<li className="p-2 border border-gray-200 dark:border-gray-500">
			<fetcher.Form
				method="post"
				onChange={(event) => {
					submit(event.currentTarget);
				}}
			>
				<GInput name="id" defaultValue={exercise.id} type="hidden" />
				<GInput name="name" defaultValue={exercise.name || 'error'} />
			</fetcher.Form>
		</li>
	);
}
