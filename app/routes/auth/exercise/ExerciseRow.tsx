import type { Exercise } from '@/routes/auth/exercise/model';
import GInput from '@/components/GInput';
import { redirect, useFetcher, useSubmit } from 'react-router';
import GButton from '@/components/GButton';
import type { Route } from '../../../../.react-router/types/app/routes/auth/+types/Home';
import { checkUser } from '@/sessions.server';
import { ROUTES } from '@/lib/consts';
import { deleteExercise } from '@/routes/auth/exercise/repository.server';

export function ExerciseRow({ exercise }: { exercise: Exercise }) {
	const fetcher = useFetcher();

	const submit = useSubmit();

	return (
		<li className="flex gap-2 p-2 border border-gray-200 dark:border-gray-500">
			<fetcher.Form
				className="flex-1"
				method="post"
				onChange={(event) => {
					submit(event.currentTarget);
				}}
			>
				<GInput name="id" defaultValue={exercise.id} type="hidden" />
				<GInput name="name" defaultValue={exercise.name || 'error'} />
			</fetcher.Form>

			<fetcher.Form method="post" action="/delete">
				<GInput name="id" defaultValue={exercise.id} type="hidden" />
				<GButton type="submit">Del</GButton>
			</fetcher.Form>
		</li>
	);
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await checkUser(request);

	const formData = await request.formData();
	const id = formData.get('id') as string;
	await deleteExercise(userId, id);

	return redirect(ROUTES.HOME);
}
