import type { Muscle } from '@/lib/utils';

export type Program = {
	id: string;
	name: string;
	muscles: Muscle[];
	createdAt: string;
};
