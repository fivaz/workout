import type { Route } from './+types/delete.action';
import { checkUser } from '@/sessions.server';
import { deleteExercise } from '@/routes/auth/exercise/repository.server';
import { redirect } from 'react-router';
import { ROUTES } from '@/lib/consts';

export async function action({ request, params }: Route.ActionArgs) {
	const userId = await checkUser(request);

	const exerciseId = params.exerciseId as string;
	await deleteExercise(userId, exerciseId);

	return { ok: true };
}
