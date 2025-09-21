
export type Program = {
	id: string;
	name: string;
	muscles: string[];
	createdAt: string;
};

export function buildEmptyProgram(): Program {
	return {
		id: '',
		name: '',
		createdAt: '',
		muscles: [],
	};
}
