import type { PropsWithChildren } from 'react';
import { ProgramContext } from '@/lib/program/programContext';
import { useCRUDPrograms } from '@/lib/program/program.hook';

export function ProgramProvider({ children }: PropsWithChildren) {
	const value = useCRUDPrograms();

	return <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>;
}
