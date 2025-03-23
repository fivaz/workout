import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	route('login', 'routes/auth/Login.tsx'),
	route('register', 'routes/auth/Register.tsx'),
	layout('routes/dashboard/AuthLayout.tsx', [
		index('routes/dashboard/Home.tsx'),
		route('logout', 'routes/dashboard/Logout.tsx'),
	]),
] satisfies RouteConfig;
