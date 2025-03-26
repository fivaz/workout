import { type Set } from '@/routes/server/auth/set/model';

export type Exercise = {
	id: string;
	name: string;
	updatedAt: string;
	sets?: Set[];
};
