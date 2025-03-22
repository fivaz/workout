import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	route('login', 'routes/auth/login.tsx'),
	route('register', 'routes/auth/register.tsx'),

	layout('routes/dashboard/layout.tsx', [index('routes/dashboard/home.tsx')]),
] satisfies RouteConfig;
