import { type Set } from '@/routes/auth/set/model';

export type Exercise = {
	id: string;
	name: string;
	updatedAt: string;
	sets?: Set[];
};
