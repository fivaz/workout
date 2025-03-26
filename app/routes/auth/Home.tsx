import { data, redirect, useFetcher, useLoaderData } from 'react-router';
import type { Route } from './+types/Home';
import { checkUser } from '@/sessions.server';
import { addExercise, getExercises } from '@/routes/auth/exercise/repository.server';
import { buildExercise } from '@/routes/auth/exercise/model';
import GText from '@/components/GText';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import GButton from '@/components/GButton';
import { useState } from 'react';
import { ROUTES } from '@/lib/consts';
import { ExerciseFormButton } from '@/routes/auth/exercise/ExerciseFormButton';
import GAlert from '@/components/GAlert';

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

export default function Home({ loaderData }: Route.ComponentProps) {
	const { error, exercises } = loaderData;
	const optimisticExercises = [...exercises];

	return (
		<div className="mt-5 p-3">
			<GText tag="h1">Exercises</GText>
			<GAlert>{error}</GAlert>
			<ul>
				{optimisticExercises.map((exercise) => (
					<li key={exercise.id}>{exercise.name}</li>
				))}
			</ul>

			<ExerciseFormButton>Add Exercise</ExerciseFormButton>
		</div>
	);
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await checkUser(request);

	const formData = await request.formData();
	await addExercise(userId, formData);

	return redirect(ROUTES.HOME);
}
