import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	layout('routes/server/guest/GuestLayout.tsx', [
		route('server/login', 'routes/server/guest/Login.tsx'),
		route('server/register', 'routes/server/guest/Register.tsx'),
	]),
	layout('routes/server/auth/AuthLayout.tsx', [
		route('server/', 'routes/server/auth/Home.tsx'),
		route('server/exercise/:exerciseId/delete', 'routes/server/auth/exercise/delete.action.ts'),
		route('server/exercise/:exerciseId/sets', 'routes/server/auth/exercise/sets.action.ts'),
		route(
			'server/exercise/:exerciseId/sets/:setId/delete',
			'routes/server/auth/exercise/set/delete.action.ts',
		),
	]),
	route('server/logout', 'routes/server/auth/Logout.tsx'),
] satisfies RouteConfig;
