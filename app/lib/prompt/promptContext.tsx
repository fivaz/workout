import { createContext } from 'react';

export type PromptOptions = {
	title: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
};

export type PromptContextType = {
	createPrompt: (options: PromptOptions) => Promise<boolean | null>;
	closePrompt: () => void;
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export default PromptContext;
