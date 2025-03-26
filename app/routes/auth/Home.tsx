import { data, redirect } from 'react-router';
import type { Route } from './+types/Home';
import { checkUser } from '@/sessions.server';
import { getExercises, updateExercise } from '@/routes/auth/exercise/repository.server';
import GText from '@/components/GText';
import { ROUTES } from '@/lib/consts';
import { ExerciseFormButton } from '@/routes/auth/exercise/ExerciseFormButton';
import GAlert from '@/components/GAlert';
import { ExerciseRow } from '@/routes/auth/exercise/ExerciseRow';

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const userId = await checkUser(request);

		// Fetch exercises from Firestore
		const exercises = await getExercises(userId);

		return data({ exercises, error: null });
	} catch (error) {
		console.error(error);
		if (error instanceof Response) {
			return redirect('/login');
		}
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return data({ exercises: [], error: errorMessage }, { status: 500 });
	}
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { error, exercises } = loaderData;
	const optimisticExercises = [...exercises];

	return (
		<div className="mt-5 p-3">
			<div className="p-3 flex flex-col gap-3 border dark:border-gray-600 border-gray-200">
				<GText tag="h1">Exercises</GText>
				<GAlert>{error}</GAlert>

				<ul className="p-2 border border-gray-200 dark:border-gray-500 divide-y divide-gray-200 dark:divide-gray-500">
					{optimisticExercises.map((exercise) => (
						<ExerciseRow key={exercise.id} exercise={exercise} />
					))}
				</ul>

				<ExerciseFormButton>Add Exercise</ExerciseFormButton>
			</div>
		</div>
	);
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await checkUser(request);

	const formData = await request.formData();
	await updateExercise(userId, formData);

	return redirect(ROUTES.HOME);
}
