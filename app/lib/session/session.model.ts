import type { Program } from '../program/program.model';
import type { Exercise } from '@/lib/exercise/exercise.model';

export type Session = {
	id: string;
	programId: string;
	programNameSnapshot: string;
	startAt: string;
	date: string;
};
