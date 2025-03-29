import { format, formatDate, parse } from 'date-fns';

export const ROUTES = {
	LOGIN: '/login',
	REGISTER: '/register',
	HOME: '/',
	PROGRAMS: '/programs',
	STATS: '/stats',
};

export const DB = {
	USERS: 'users',
	EXERCISES: 'exercises',
	WORKOUTS: 'workouts',
	PROGRAMS: 'programs',
};

export const DATE = 'yyyy-MM-dd';

export function gFormatDate(date: Date) {
	return format(date, DATE);
}

export function gParseDate(dateString: string) {
	return parse(dateString, DATE, new Date());
}
