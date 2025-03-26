import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	layout('routes/guest/GuestLayout.tsx', [
		route('login', 'routes/guest/Login.tsx'),
		route('register', 'routes/guest/Register.tsx'),
	]),
	layout('routes/auth/AuthLayout.tsx', [index('routes/auth/Home.tsx')]),
	route('logout', 'routes/auth/Logout.tsx'),
] satisfies RouteConfig;
