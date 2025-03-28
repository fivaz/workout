import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	//client
	layout('routes/guest/GuestLayout.tsx', [
		route('login', 'routes/guest/Login.tsx'),
		route('register', 'routes/guest/Register.tsx'),
	]),

	layout('routes/auth/AuthLayout.tsx', [index('routes/auth/Home/Home.tsx')]),
] satisfies RouteConfig;
