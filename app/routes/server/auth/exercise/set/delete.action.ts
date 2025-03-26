import type { Route } from './+types/delete.action';
import { checkUser } from '@/sessions.server';
import { deleteSet } from '@/routes/server/auth/set/repository.server';
import { redirect } from 'react-router';
import { SERVER_ROUTES } from '@/lib/consts';

export async function action({ request, params }: Route.ActionArgs) {
	const userId = await checkUser(request);

	const exerciseId = params.exerciseId as string;
	const setId = params.setId as string;
	await deleteSet(userId, exerciseId, setId);

	return { ok: true };
}
