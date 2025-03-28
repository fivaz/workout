import { format, formatDate, parse } from 'date-fns';

export const SERVER_ROUTES = {
	LOGIN: '/server/login',
	REGISTER: '/server/register',
	LOGOUT: '/server/logout',
	HOME: '/server/',
};

export const ROUTES = {
	LOGIN: '/login',
	REGISTER: '/register',
	HOME: '/',
};

export const DB = {
	USERS: 'users',
	EXERCISES: 'exercises',
	WORKOUTS: 'workouts',
};

export const DATE = 'yyyy-MM-dd';

export function gFormatDate(date: Date) {
	return format(date, DATE);
}

export function gParseDate(dateString: string) {
	return parse(dateString, DATE, new Date());
}
