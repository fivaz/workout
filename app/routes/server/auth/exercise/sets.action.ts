import { checkUser } from '@/sessions.server';
import type { Route } from './+types/sets.action';
import { SERVER_ROUTES } from '@/lib/consts';
import { redirect } from 'react-router';
import { updateSet } from '@/routes/server/auth/set/repository.server';

export async function action({ request, params }: Route.ActionArgs) {
	const userId = await checkUser(request);
	const exerciseId = params.exerciseId as string;

	const formData = await request.formData();
	await updateSet(userId, exerciseId, formData);

	return { ok: true };
}
