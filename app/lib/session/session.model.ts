import type { Program } from '../program/program.model';
import { gFormatDate, gFormatTime } from '@/lib/consts';

export type Session = {
	id: string;
	programId: string;
	programNameSnapshot: string;
	startAt: string;
	endAt: string;
	date: string;
};

export function buildEmptySession(program: Program): Session {
	const today = new Date();

	const date = gFormatDate(today);
	const startAt = gFormatTime(today);

	return {
		id: '',
		programId: program.id,
		programNameSnapshot: program.name,
		date,
		startAt,
		endAt: '',
	};
}
