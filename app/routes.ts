import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
	//client
	layout('routes/guest/GuestLayout.tsx', [
		route('login', 'routes/guest/Login.tsx'),
		route('register', 'routes/guest/Register.tsx'),
	]),

	layout('routes/auth/AuthLayout.tsx', [
		index('routes/auth/Train/TrainPage.tsx'),
		route('programs', 'routes/auth/Programs/Programs.tsx'),
		route('report', 'routes/auth/Summary/SummaryPage.tsx'),
		route('programs/:programId', 'routes/auth/Programs/ProgramRow/ProgramPage/ProgramPage.tsx'),
		route('stats', 'routes/auth/Stats/Stats.tsx'),
		route('settings', 'routes/auth/Settings/Settings.tsx'),
	]),
] satisfies RouteConfig;
