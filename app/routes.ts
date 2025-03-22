import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	route('login', 'routes/auth/Login.tsx'),
	layout('routes/dashboard/AuthLayout.tsx', [index('routes/dashboard/Home.tsx')]),
] satisfies RouteConfig;
