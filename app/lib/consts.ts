import { format, parse } from 'date-fns';

export const ROUTES = {
	LOGIN: '/login',
	REGISTER: '/register',
	PROGRAMS: '/programs',
	STATS: '/stats',
	SETTINGS: '/settings',
	REPORT: (programId: string) => `/report?program=${programId}`,
	TRAIN: '/',
};

export const DB = {
	USERS: 'users',
	EXERCISES: 'exercises',
	WORKOUTS: 'workouts',
	PROGRAMS: 'programs',
	MEASUREMENTS: 'measurements',
	SESSIONS: 'sessions',
};

export const DATE = 'yyyy-MM-dd';

export const TIME = 'hh:mm:ss';

export function gFormatDate(date: Date) {
	return format(date, DATE);
}

export function gFormatTime(date: Date) {
	return format(date, TIME);
}

export function gParseDate(dateString: string) {
	return parse(dateString, DATE, new Date());
}
