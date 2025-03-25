import { data, redirect, useFetcher, useLoaderData } from 'react-router';
import type { Route } from './+types/Home';
import { checkUser } from '@/sessions.server';
import { getExercises } from '@/routes/auth/exercise/repository';
import GText from '@/components/GText';
import type { Exercise } from '@/routes/auth/exercise/model';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import { useState } from 'react';

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const userId = await checkUser(request);

		// Fetch exercises from Firestore
		const exercises = await getExercises(userId);

		return data({ userId, exercises, error: null });
	} catch (error) {
		console.error(error);
		if (error instanceof Response) {
			return redirect('/login');
		}
		return data(
			{
				exercises: [],
				userId: '',
				error: 'Failed to fetch exercises',
			},
			{ status: 500 },
		);
	}
}

export default function Home() {
	const { userId, error, exercises } = useLoaderData<typeof loader>();
	const fetcher = useFetcher();
	const isSubmitting = fetcher.state === 'submitting' || fetcher.state === 'loading';
	const [isOpen, setIsOpen] = useState(true);

	const optimisticExercises = [...exercises];

	if (fetcher.formData) {
		const newName = fetcher.formData.get('name') as string;
		optimisticExercises.push({ id: Date.now(), name: newName } as unknown as Exercise);
		console.log(optimisticExercises);
	}

	return (
		<div className="mt-5 p-3">
			<GText tag="h1">Exercises</GText>
			<div>userId: {userId}</div>
			<div>exercises length: {optimisticExercises.length}</div>
			<ul>
				{optimisticExercises.map((exercise) => (
					<li key={exercise.id}>{exercise.name}</li>
				))}
			</ul>

			<GDialog open={isOpen} onClose={setIsOpen}>
				<fetcher.Form method="post" action="/test">
					<DialogTitle>Add exercise</DialogTitle>
					<DialogBody>
						<GInput label="name" />
					</DialogBody>
					<DialogActions>
						<GButton isLoading={isSubmitting} onClick={() => setIsOpen(false)}>
							Cancel
						</GButton>
						<GButton isLoading={isSubmitting} type="submit">
							Save
						</GButton>
					</DialogActions>
				</fetcher.Form>
			</GDialog>
		</div>
	);
}

export async function action({ request }: Route.ActionArgs) {
	console.log('here');
	const userId = await checkUser(request);

	const formData = await request.formData();
	const name = formData.get('name');

	return redirect('/test');
}
