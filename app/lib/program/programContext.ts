// Custom hook to use the program context
import { createContext, useContext } from 'react';
import type { Program } from '@/lib/program/program.model';

// Define the context type
export interface ProgramContextType {
	programs: Program[];
	createProgram: (program: Program) => void;
	updateProgram: (program: Program) => void;
	deleteProgram: (program: Program) => void;
}

// Create the context
export const ProgramContext = createContext<ProgramContextType>({
	programs: [],
	createProgram: (program: Program) => {},
	updateProgram: (program: Program) => {},
	deleteProgram: (program: Program) => {},
});

export function usePrograms() {
	const context = useContext(ProgramContext);
	if (context === undefined) {
		throw new Error('usePrograms must be used within an ProgramProvider');
	}
	return context;
}
