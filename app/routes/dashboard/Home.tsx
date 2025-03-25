import { data, redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/Home';
import { checkUser } from '@/sessions.server';
import { getExercises } from '@/routes/dashboard/exercise/repository';

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

	return (
		<pre>
			userId: {userId}
			exercises length: {exercises.length}
		</pre>
	);
}
