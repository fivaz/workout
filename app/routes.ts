import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	layout('routes/guest/GuestLayout.tsx', [
		route('login', 'routes/guest/Login.tsx'),
		route('register', 'routes/guest/Register.tsx'),
	]),
	layout('routes/auth/AuthLayout.tsx', [
		index('routes/auth/Home.tsx'),
		route('exercise/:exerciseId/delete', 'routes/auth/exercise/delete.action.ts'),
		route('exercise/:exerciseId/sets', 'routes/auth/exercise/sets.action.ts'),
		route('exercise/:exerciseId/sets/:setId/delete', 'routes/auth/exercise/set/delete.action.ts'),
	]),
	route('logout', 'routes/auth/Logout.tsx'),
] satisfies RouteConfig;
